import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto, UpdateOrderDto, OrderItemDto } from '../dto/order.dto';
import { ProductsService } from '../../products/services/products.service';
import { CustomersService } from '../../customers/services/customers.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['customer', 'items', 'items.product'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product'],
    });
    
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    
    return order;
  }

  async findByDermofarmId(dermofarmId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ 
      where: { dermofarmId },
      relations: ['customer', 'items', 'items.product'],
    });
    
    if (!order) {
      throw new NotFoundException(`Orden con ID de Dermofarm ${dermofarmId} no encontrada`);
    }
    
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Verificar que el cliente existe
    const customer = await this.customersService.findOne(createOrderDto.customerId);
    
    // Crear la orden
    const order = this.orderRepository.create({
      dermofarmId: createOrderDto.dermofarmId,
      customer,
      total: createOrderDto.total,
      status: createOrderDto.status,
      lastSync: new Date(),
    });
    
    // Guardar la orden para obtener su ID
    const savedOrder = await this.orderRepository.save(order);
    
    // Procesar los items de la orden
    const orderItems = await this.createOrderItems(createOrderDto.items, savedOrder);
    savedOrder.items = orderItems;
    
    return savedOrder;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    // Actualizar campos básicos
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }
    
    if (updateOrderDto.total) {
      order.total = updateOrderDto.total;
    }
    
    // Actualizar items si se proporcionaron
    if (updateOrderDto.items && updateOrderDto.items.length > 0) {
      // Eliminar items existentes
      if (order.items && order.items.length > 0) {
        await this.orderItemRepository.remove(order.items);
      }
      
      // Crear nuevos items
      order.items = await this.createOrderItems(updateOrderDto.items, order);
    }
    
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    
    // Eliminar items primero (debido a la relación)
    if (order.items && order.items.length > 0) {
      await this.orderItemRepository.remove(order.items);
    }
    
    await this.orderRepository.remove(order);
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async syncOrders(dermofarmOrders: CreateOrderDto[]): Promise<Order[]> {
    const syncedOrders: Order[] = [];
    
    for (const dermofarmOrder of dermofarmOrders) {
      try {
        // Buscar si la orden ya existe
        let existingOrder: Order | null = null;
        try {
          existingOrder = await this.orderRepository.findOne({ 
            where: { dermofarmId: dermofarmOrder.dermofarmId },
            relations: ['items'],
          });
        } catch (error) {
          // La orden no existe, continuamos con la creación
        }
        
        if (existingOrder) {
          // Actualizar orden existente
          if (existingOrder.items && existingOrder.items.length > 0) {
            await this.orderItemRepository.remove(existingOrder.items);
          }
          
          // Actualizar campos básicos
          if (dermofarmOrder.status !== undefined) {
            existingOrder.status = dermofarmOrder.status;
          }
          existingOrder.total = dermofarmOrder.total;
          existingOrder.lastSync = new Date();
          
          // Guardar la orden actualizada
          await this.orderRepository.save(existingOrder);
          
          // Crear nuevos items
          existingOrder.items = await this.createOrderItems(dermofarmOrder.items, existingOrder);
          
          // Guardar la orden con los items actualizados
          const updated = await this.orderRepository.save(existingOrder);
          syncedOrders.push(updated);
        } else {
          // Crear nueva orden
          const newOrder = await this.create(dermofarmOrder);
          syncedOrders.push(newOrder);
        }
      } catch (error) {
        console.error(`Error sincronizando orden ${dermofarmOrder.dermofarmId}:`, error);
      }
    }
    
    return syncedOrders;
  }

  // Método privado para crear items de orden
  private async createOrderItems(items: OrderItemDto[], order: Order): Promise<OrderItem[]> {
    const orderItems: OrderItem[] = [];
    
    for (const item of items) {
      try {
        const product = await this.productsService.findOne(item.productId);
        
        const orderItem = this.orderItemRepository.create({
          order,
          product,
          quantity: item.quantity,
          price: item.price,
        });
        
        const savedItem = await this.orderItemRepository.save(orderItem);
        orderItems.push(savedItem);
      } catch (error) {
        console.error(`Error creando item para producto ${item.productId}:`, error);
        throw new BadRequestException(`Error al procesar el producto ${item.productId}: ${error.message}`);
      }
    }
    
    return orderItems;
  }
}