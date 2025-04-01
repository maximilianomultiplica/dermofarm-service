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
import { OrderService } from "../services/order.service";
import {
  CreateOrderDto,
  UpdateOrderDto,
  OrderResponseDto,
  OrderStatus,
} from "../dto/order.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { PaginatedResponseDto } from "../dto/paginated-response.dto";
import { Order } from "../entities/order.entity";

@ApiTags("orders")
@Controller("orders")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles("admin", "operator")
  @ApiOperation({ summary: "Crear una nueva orden" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "La orden ha sido creada exitosamente",
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Datos de orden inválidos",
  })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    try {
      const order = await this.orderService.create(createOrderDto);
      this.logger.log(`Orden creada con ID: ${order.id}`);
      return this.mapToResponseDto(order);
    } catch (error) {
      this.logger.error(`Error al crear orden: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: "Obtener todas las órdenes" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, enum: OrderStatus })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Lista de órdenes obtenida exitosamente",
    type: [OrderResponseDto],
  })
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("status") status?: OrderStatus
  ): Promise<PaginatedResponseDto<OrderResponseDto>> {
    try {
      const { items, total } = await this.orderService.findAll(page, limit, status);
      return {
        items: items.map(item => this.mapToResponseDto(item)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      this.logger.error(`Error al obtener órdenes: ${error.message}`, error.stack);
      throw error;
    }
  }

  private mapToResponseDto(order: Order): OrderResponseDto {
    const responseDto = new OrderResponseDto();
    Object.assign(responseDto, {
      ...order,
      customerId: order.customer?.id,
      totalAmount: order.total,
      shippingAddress: "Default shipping address", // Esto debería venir de los datos reales
    });
    return responseDto;
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener una orden por ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Orden encontrada exitosamente",
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Orden no encontrada",
  })
  async findOne(@Param("id") id: string): Promise<any> {
    const order = await this.orderService.findOne(+id);
    // Convert to response DTO format
    return {
      ...order,
      customerId: order.customer?.id || 0,
      totalAmount: order.total || 0,
      shippingAddress: "Default shipping address", // This should be replaced with actual address
    };
  }

  @Patch(":id")
  @Roles("admin", "operator")
  @ApiOperation({ summary: "Actualizar una orden" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Orden actualizada exitosamente",
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Orden no encontrada",
  })
  async update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<any> {
    const order = await this.orderService.update(+id, updateOrderDto);
    // Convert to response DTO format
    return {
      ...order,
      customerId: order.customer?.id || 0,
      totalAmount: order.total || 0,
      shippingAddress: updateOrderDto.shippingAddress || "Default shipping address",
    };
  }

  @Delete(":id")
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Eliminar una orden" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Orden eliminada exitosamente",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Orden no encontrada",
  })
  async remove(@Param("id") id: string): Promise<void> {
    await this.orderService.remove(+id);
  }

  @Post("sync")
  @Roles("admin")
  @ApiOperation({ summary: "Sincronizar órdenes con DERMOFARM" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Sincronización completada exitosamente",
  })
  async syncOrders() {
    return this.orderService.syncWithDermofarm();
  }

  @Patch(":id/status")
  @Roles("admin", "operator")
  @ApiOperation({ summary: "Actualizar el estado de una orden" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Estado de la orden actualizado exitosamente",
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Orden no encontrada",
  })
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: OrderStatus
  ): Promise<OrderResponseDto> {
    // This is temporarily commented out until we add this method
    // return this.orderService.updateStatus(+id, status);
    throw new NotFoundException("Method not implemented");
  }
}
