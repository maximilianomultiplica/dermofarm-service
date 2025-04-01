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
  NotFoundException,
  UseInterceptors,
  Logger,
  DefaultValuePipe,
  ParseIntPipe,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { CustomerService } from "../services/customer.service";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerResponseDto,
} from "../dto/customer.dto";
import { OrderResponseDto, OrderStatus } from "../dto/order.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { PaginatedResponseDto } from "../dto/paginated-response.dto";
import { Customer } from "../entities/customer.entity";

@ApiTags("customers")
@Controller("customers")
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Roles("admin", "operator")
  @ApiOperation({ summary: "Crear un nuevo cliente" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "El cliente ha sido creado exitosamente",
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Datos de cliente inválidos",
  })
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
    try {
      const customer = await this.customerService.create(createCustomerDto);
      this.logger.log(`Cliente creado con ID: ${customer.id}`);
      return this.mapToResponseDto(customer);
    } catch (error) {
      this.logger.error(`Error al crear cliente: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: "Obtener todos los clientes" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Lista de clientes obtenida exitosamente",
    type: [CustomerResponseDto],
  })
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("search") search?: string
  ): Promise<PaginatedResponseDto<CustomerResponseDto>> {
    try {
      const { items, total } = await this.customerService.findAll(page, limit, search);
      return {
        items: items.map(item => this.mapToResponseDto(item)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      this.logger.error(`Error al obtener clientes: ${error.message}`, error.stack);
      throw error;
    }
  }

  private mapToResponseDto(customer: Customer): CustomerResponseDto {
    const responseDto = new CustomerResponseDto();
    Object.assign(responseDto, customer);
    return responseDto;
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un cliente por ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Cliente encontrado exitosamente",
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Cliente no encontrado",
  })
  async findOne(@Param("id") id: string): Promise<any> {
    const customer = await this.customerService.findOne(+id);
    // Convert to response DTO format 
    return {
      ...customer,
      address: "Default address", // This should be replaced with actual address when available
    };
  }

  @Patch(":id")
  @Roles("admin", "operator")
  @ApiOperation({ summary: "Actualizar un cliente" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Cliente actualizado exitosamente",
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Cliente no encontrado",
  })
  async update(
    @Param("id") id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ): Promise<any> {
    const customer = await this.customerService.update(+id, updateCustomerDto);
    // Convert to response DTO format
    return {
      ...customer,
      address: updateCustomerDto.address || "Default address",
    };
  }

  @Delete(":id")
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Eliminar un cliente" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Cliente eliminado exitosamente",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Cliente no encontrado",
  })
  async remove(@Param("id") id: string): Promise<void> {
    await this.customerService.remove(+id);
  }

  @Post("sync")
  @Roles("admin")
  @ApiOperation({ summary: "Sincronizar clientes con DERMOFARM" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Sincronización completada exitosamente",
  })
  async syncCustomers() {
    return this.customerService.syncWithDermofarm();
  }

  @Get(":id/orders")
  @ApiOperation({ summary: "Obtener órdenes de un cliente" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Órdenes del cliente obtenidas exitosamente",
    type: [OrderResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Cliente no encontrado",
  })
  async getCustomerOrders(
    @Param("id", ParseIntPipe) id: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<PaginatedResponseDto<OrderResponseDto>> {
    try {
      const result = await this.customerService.getCustomerOrders(id, page, limit);
      return {
        items: result.items.map(order => ({
          id: order.id,
          dermofarmId: order.dermofarmId,
          customerId: order.customer?.id || id,
          items: order.items?.map(item => ({
            id: item.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price
          })) || [],
          total: order.total,
          totalAmount: order.total,
          status: order.status as OrderStatus,
          shippingAddress: "Default shipping address",
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        })),
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      };
    } catch (error) {
      this.logger.error(`Error al obtener órdenes del cliente ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
