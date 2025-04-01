import {
  Controller,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { SyncService } from '../services/sync.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/dto/auth.dto';

@ApiTags('sync')
@Controller('sync')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Sincronizar todos los datos con DERMOFARM' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sincronización completa realizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  syncAll() {
    return this.syncService.syncAll();
  }

  @Post('products')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Sincronizar productos con DERMOFARM' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Productos sincronizados exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  syncProducts() {
    return this.syncService.syncProducts();
  }

  @Post('customers')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Sincronizar clientes con DERMOFARM' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clientes sincronizados exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  syncCustomers() {
    return this.syncService.syncCustomers();
  }

  @Post('orders')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Sincronizar órdenes con DERMOFARM' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Órdenes sincronizadas exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  syncOrders() {
    return this.syncService.syncOrders();
  }
}