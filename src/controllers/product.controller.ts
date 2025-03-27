import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { ProductService } from "../services/product.service";
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from "../dto/product.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";

@ApiTags("products")
@Controller("products")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles("admin")
  @ApiOperation({ summary: "Crear un nuevo producto" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "El producto ha sido creado exitosamente",
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Datos de producto inválidos",
  })
  async create(
    @Body() createProductDto: CreateProductDto
  ): Promise<any> {
    const product = await this.productService.create(createProductDto);
    // Convert to response DTO format
    return {
      ...product,
      sku: createProductDto.sku,
      isActive: createProductDto.isActive ?? true,
    };
  }

  @Get()
  @ApiOperation({ summary: "Obtener todos los productos" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Lista de productos obtenida exitosamente",
    type: [ProductResponseDto],
  })
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search?: string
  ) {
    return this.productService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un producto por ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Producto encontrado exitosamente",
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Producto no encontrado",
  })
  async findOne(@Param("id") id: string): Promise<any> {
    const product = await this.productService.findOne(+id);
    // Convert to response DTO format
    return {
      ...product,
      sku: "SKU-" + product.id,
      isActive: true,
    };
  }

  @Patch(":id")
  @Roles("admin")
  @ApiOperation({ summary: "Actualizar un producto" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Producto actualizado exitosamente",
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Producto no encontrado",
  })
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<any> {
    const product = await this.productService.update(+id, updateProductDto);
    // Convert to response DTO format
    return {
      ...product,
      sku: updateProductDto.sku || "SKU-" + product.id,
      isActive: updateProductDto.isActive !== undefined ? updateProductDto.isActive : true,
    };
  }

  @Delete(":id")
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Eliminar un producto" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Producto eliminado exitosamente",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Producto no encontrado",
  })
  async remove(@Param("id") id: string): Promise<void> {
    await this.productService.remove(+id);
  }

  @Post("sync")
  @Roles("admin")
  @ApiOperation({ summary: "Sincronizar productos con DERMOFARM" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Sincronización completada exitosamente",
  })
  async syncProducts() {
    return this.productService.syncWithDermofarm();
  }
}
