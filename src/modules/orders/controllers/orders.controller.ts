import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { OrdersService } from '../services/orders.service';
import { 
  CreateOrderDto, 
  UpdateOrderDto, 
  OrderResponseDto,
  OrderStatus
} from '../dto/order.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/dto/auth.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de órdenes obtenida exitosamente',
    type: [OrderResponseDto],
  })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden encontrada exitosamente',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Orden creada exitosamente',
    type: OrderResponseDto,
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Actualizar una orden existente' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden actualizada exitosamente',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar una orden' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Orden eliminada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Actualizar el estado de una orden' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(OrderStatus),
          example: OrderStatus.PROCESSING,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estado de la orden actualizado exitosamente',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(+id, status);
  }

  @Post('sync')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Sincronizar órdenes con DERMOFARM' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Órdenes sincronizadas exitosamente',
    type: [OrderResponseDto],
  })
  syncOrders(@Body() orders: CreateOrderDto[]) {
    return this.ordersService.syncOrders(orders);
  }
}