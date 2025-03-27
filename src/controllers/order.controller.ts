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

@ApiTags("orders")
@Controller("orders")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrderController {
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
  async create(
    @Body() createOrderDto: CreateOrderDto
  ): Promise<any> {
    const order = await this.orderService.create(createOrderDto);
    // Convert to response DTO format
    return {
      ...order,
      customerId: createOrderDto.customerId,
      totalAmount: order.total || 0,
      shippingAddress: createOrderDto.shippingAddress,
    };
  }

  @Get()
  @ApiOperation({ summary: "Obtener todas las órdenes" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, enum: OrderStatus })
  @ApiQuery({ name: "customerId", required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Lista de órdenes obtenida exitosamente",
    type: [OrderResponseDto],
  })
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("status") status?: OrderStatus,
    @Query("customerId") customerId?: number
  ) {
    return this.orderService.findAll();
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
