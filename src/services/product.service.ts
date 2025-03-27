import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../entities/product.entity";
import { CreateProductDto } from "../dto/product.dto";
import { UpdateProductDto } from "../dto/product.dto";
import { DermofarmService } from "./dermofarm.service";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dermofarmService: DermofarmService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async syncWithDermofarm(): Promise<void> {
    try {
      const dermofarmProducts = await this.dermofarmService.getProducts() as any[];

      for (const dermofarmProduct of dermofarmProducts) {
        const existingProduct = await this.productRepository.findOne({
          where: { dermofarmId: dermofarmProduct.id },
        });

        if (existingProduct) {
          // Update existing product
          Object.assign(existingProduct, {
            name: dermofarmProduct.name,
            description: dermofarmProduct.description,
            price: dermofarmProduct.price,
            stock: dermofarmProduct.stock,
            lastSync: new Date(),
          });
          await this.productRepository.save(existingProduct);
        } else {
          // Create new product
          const newProduct = this.productRepository.create({
            dermofarmId: dermofarmProduct.id,
            name: dermofarmProduct.name,
            description: dermofarmProduct.description,
            price: dermofarmProduct.price,
            stock: dermofarmProduct.stock,
            lastSync: new Date(),
          });
          await this.productRepository.save(newProduct);
        }
      }
    } catch (error) {
      throw new BadRequestException("Failed to sync products with DERMOFARM");
    }
  }
}
