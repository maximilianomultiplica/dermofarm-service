import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async findByDermofarmId(dermofarmId: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { dermofarmId } });
    if (!product) {
      throw new NotFoundException(`Producto con ID de Dermofarm ${dermofarmId} no encontrado`);
    }
    return product;
  }

  create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    // Actualizar solo los campos proporcionados
    Object.assign(product, updateProductDto);
    
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async syncProducts(dermofarmProducts: CreateProductDto[]): Promise<Product[]> {
    const syncedProducts: Product[] = [];
    
    for (const dermofarmProduct of dermofarmProducts) {
      try {
        // Buscar si el producto ya existe
        const existingProduct = await this.productRepository.findOne({ 
          where: { dermofarmId: dermofarmProduct.dermofarmId } 
        });
        
        if (existingProduct) {
          // Actualizar producto existente
          Object.assign(existingProduct, dermofarmProduct);
          existingProduct.lastSync = new Date();
          const updated = await this.productRepository.save(existingProduct);
          syncedProducts.push(updated);
        } else {
          // Crear nuevo producto
          const newProduct = this.productRepository.create({
            ...dermofarmProduct,
            lastSync: new Date()
          });
          const saved = await this.productRepository.save(newProduct);
          syncedProducts.push(saved);
        }
      } catch (error) {
        console.error(`Error sincronizando producto ${dermofarmProduct.dermofarmId}:`, error);
      }
    }
    
    return syncedProducts;
  }
}