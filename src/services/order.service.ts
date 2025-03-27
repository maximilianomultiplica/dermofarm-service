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

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dermofarmService: DermofarmService
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ["customer", "items", "items.product"],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ["customer", "items", "items.product"],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
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
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async findByCustomer(customerId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { customer: { id: customerId } },
      relations: ["items", "items.product"],
    });
  }

  async syncWithDermofarm(): Promise<void> {
    try {
      const dermofarmOrders =
        (await this.dermofarmService.getOrders()) as any[];

      for (const dermofarmOrder of dermofarmOrders) {
        const existingOrder = await this.orderRepository.findOne({
          where: { dermofarmId: dermofarmOrder.id },
        });

        if (existingOrder) {
          // Update existing order
          Object.assign(existingOrder, {
            status: dermofarmOrder.status,
            total: dermofarmOrder.total,
            lastSync: new Date(),
          });
          await this.orderRepository.save(existingOrder);
        } else {
          // Create new order
          const newOrder = this.orderRepository.create({
            dermofarmId: dermofarmOrder.id,
            status: dermofarmOrder.status,
            total: dermofarmOrder.total,
            lastSync: new Date(),
          });
          await this.orderRepository.save(newOrder);
        }
      }
    } catch (error) {
      throw new BadRequestException("Failed to sync orders with DERMOFARM");
    }
  }
}
