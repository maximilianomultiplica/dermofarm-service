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

  async findAll(page = 1, limit = 10, search?: string): Promise<{ items: Product[], total: number }> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    
    if (search) {
      queryBuilder.where('product.name LIKE :search OR product.description LIKE :search', {
        search: `%${search}%`
      });
    }

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .cache(true) // Habilitar caché
      .getManyAndCount();

    return { items, total };
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
      
      await this.productRepository.manager.transaction(async transactionalEntityManager => {
        const chunks = this.chunkArray(dermofarmProducts, 50);
        
        for (const chunk of chunks) {
          await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into(Product)
            .values(chunk.map(p => ({
              dermofarmId: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              stock: p.stock,
              lastSync: new Date()
            })))
            .orUpdate(
              ['name', 'description', 'price', 'stock', 'lastSync'],
              ['dermofarmId']
            )
            .execute();
        }
      });
    } catch (error) {
      throw new BadRequestException(`Failed to sync products with DERMOFARM: ${error.message}`);
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
