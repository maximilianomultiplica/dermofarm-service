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

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly dermofarmService: DermofarmService
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto
  ): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const result = await this.customerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  async syncWithDermofarm(): Promise<void> {
    try {
      const dermofarmCustomers =
        (await this.dermofarmService.getCustomers()) as any[];

      for (const dermofarmCustomer of dermofarmCustomers) {
        const existingCustomer = await this.customerRepository.findOne({
          where: { dermofarmId: dermofarmCustomer.id },
        });

        if (existingCustomer) {
          // Update existing customer
          Object.assign(existingCustomer, {
            name: dermofarmCustomer.name,
            email: dermofarmCustomer.email,
            phone: dermofarmCustomer.phone,
            lastSync: new Date(),
          });
          await this.customerRepository.save(existingCustomer);
        } else {
          // Create new customer
          const newCustomer = this.customerRepository.create({
            dermofarmId: dermofarmCustomer.id,
            name: dermofarmCustomer.name,
            email: dermofarmCustomer.email,
            phone: dermofarmCustomer.phone,
            lastSync: new Date(),
          });
          await this.customerRepository.save(newCustomer);
        }
      }
    } catch (error) {
      throw new BadRequestException("Failed to sync customers with DERMOFARM");
    }
  }
}
