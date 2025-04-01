import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../entities/order.entity";
import { CreateOrderDto } from "../dto/order.dto";
import { UpdateOrderDto } from "../dto/order.dto";
import { DermofarmService } from "./dermofarm.service";
import { Logger } from "@nestjs/common";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dermofarmService: DermofarmService,
    private readonly logger: Logger
  ) {
    this.logger = new Logger(OrderService.name);
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }

  async findAll(page = 1, limit = 10, status?: string): Promise<{ items: Order[], total: number }> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');
    
    if (status) {
      queryBuilder.where('order.status = :status', { status });
    }

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .cache(true)
      .getManyAndCount();

    return { items, total };
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

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
  }

  async syncWithDermofarm(): Promise<void> {
    try {
      const dermofarmOrders = await this.dermofarmService.getOrders() as any[];
      
      await this.orderRepository.manager.transaction(async transactionalEntityManager => {
        const chunks = this.chunkArray(dermofarmOrders, 50);
        
        for (const chunk of chunks) {
          await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into(Order)
            .values(chunk.map(o => ({
              dermofarmId: o.id,
              status: o.status,
              total: o.total,
              lastSync: new Date()
            })))
            .orUpdate(
              ['status', 'total', 'lastSync'],
              ['dermofarmId']
            )
            .execute();
        }
      });

      this.logger.log('Order synchronization completed successfully');
    } catch (error) {
      this.logger.error('Failed to sync orders', error.stack);
      throw new BadRequestException(`Failed to sync orders: ${error.message}`);
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
