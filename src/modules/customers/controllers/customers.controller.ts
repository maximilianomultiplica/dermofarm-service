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
  ApiParam
} from '@nestjs/swagger';
import { CustomersService } from '../services/customers.service';
import { 
  CreateCustomerDto, 
  UpdateCustomerDto, 
  CustomerResponseDto 
} from '../dto/customer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/dto/auth.dto';

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de clientes obtenida exitosamente',
    type: [CustomerResponseDto],
  })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cliente encontrado exitosamente',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente no encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Cliente creado exitosamente',
    type: CustomerResponseDto,
  })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un cliente existente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cliente actualizado exitosamente',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente no encontrado',
  })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Cliente eliminado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente no encontrado',
  })
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }

  @Post('sync')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Sincronizar clientes con DERMOFARM' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clientes sincronizados exitosamente',
    type: [CustomerResponseDto],
  })
  syncCustomers(@Body() customers: CreateCustomerDto[]) {
    return this.customersService.syncCustomers(customers);
  }
}