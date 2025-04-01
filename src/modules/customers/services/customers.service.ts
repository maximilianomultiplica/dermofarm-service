import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ 
      where: { id },
      relations: ['orders'],
    });
    
    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return customer;
  }

  async findByDermofarmId(dermofarmId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { dermofarmId } });
    
    if (!customer) {
      throw new NotFoundException(`Cliente con ID de Dermofarm ${dermofarmId} no encontrado`);
    }
    
    return customer;
  }

  create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    
    // Actualizar solo los campos proporcionados
    Object.assign(customer, updateCustomerDto);
    
    return this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }

  async syncCustomers(dermofarmCustomers: CreateCustomerDto[]): Promise<Customer[]> {
    const syncedCustomers: Customer[] = [];
    
    for (const dermofarmCustomer of dermofarmCustomers) {
      try {
        // Buscar si el cliente ya existe
        const existingCustomer = await this.customerRepository.findOne({ 
          where: { dermofarmId: dermofarmCustomer.dermofarmId } 
        });
        
        if (existingCustomer) {
          // Actualizar cliente existente
          Object.assign(existingCustomer, dermofarmCustomer);
          existingCustomer.lastSync = new Date();
          const updated = await this.customerRepository.save(existingCustomer);
          syncedCustomers.push(updated);
        } else {
          // Crear nuevo cliente
          const newCustomer = this.customerRepository.create({
            ...dermofarmCustomer,
            lastSync: new Date()
          });
          const saved = await this.customerRepository.save(newCustomer);
          syncedCustomers.push(saved);
        }
      } catch (error) {
        console.error(`Error sincronizando cliente ${dermofarmCustomer.dermofarmId}:`, error);
      }
    }
    
    return syncedCustomers;
  }
}