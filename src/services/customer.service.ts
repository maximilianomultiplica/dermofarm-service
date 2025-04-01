import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "../entities/customer.entity";
import { CreateCustomerDto } from "../dto/customer.dto";
import { UpdateCustomerDto } from "../dto/customer.dto";
import { DermofarmService } from "./dermofarm.service";
import { Logger } from "@nestjs/common";
import { Order } from "../entities/order.entity";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly dermofarmService: DermofarmService,
    private readonly logger: Logger
  ) {
    this.logger = new Logger(CustomerService.name);
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['orders']
    });
    
    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const result = await this.customerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
  }

  async findAll(page = 1, limit = 10, search?: string): Promise<{ items: Customer[], total: number }> {
    const queryBuilder = this.customerRepository.createQueryBuilder('customer');
    
    if (search) {
      queryBuilder.where('customer.name LIKE :search OR customer.email LIKE :search', {
        search: `%${search}%`
      });
    }

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .cache(true)
      .getManyAndCount();

    return { items, total };
  }

  async syncWithDermofarm(): Promise<void> {
    try {
      const dermofarmCustomers = await this.dermofarmService.getCustomers() as any[];
      
      await this.customerRepository.manager.transaction(async transactionalEntityManager => {
        const chunks = this.chunkArray(dermofarmCustomers, 50);
        
        for (const chunk of chunks) {
          await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into(Customer)
            .values(chunk.map(c => ({
              dermofarmId: c.id,
              name: c.name,
              email: c.email,
              phone: c.phone,
              lastSync: new Date()
            })))
            .orUpdate(
              ['name', 'email', 'phone', 'lastSync'],
              ['dermofarmId']
            )
            .execute();
        }
      });

      this.logger.log('Customer synchronization completed successfully');
    } catch (error) {
      this.logger.error('Failed to sync customers', error.stack);
      throw new BadRequestException(`Failed to sync customers: ${error.message}`);
    }
  }

  async getCustomerOrders(
    customerId: number,
    page: number,
    limit: number
  ): Promise<{ items: Order[]; total: number }> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: ['orders'],
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${customerId} no encontrado`);
    }

    const queryBuilder = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.orders', 'orders')
      .leftJoinAndSelect('orders.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('customer.id = :customerId', { customerId })
      .orderBy('orders.createdAt', 'DESC');

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: items[0]?.orders || [],
      total
    };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
