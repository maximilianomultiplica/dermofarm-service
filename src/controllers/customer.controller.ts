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
import { CustomerService } from "../services/customer.service";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerResponseDto,
} from "../dto/customer.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";

@ApiTags("customers")
@Controller("customers")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomerController {
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
  async create(
    @Body() createCustomerDto: CreateCustomerDto
  ): Promise<any> {
    const customer = await this.customerService.create(createCustomerDto);
    // Convert to response DTO format
    return {
      ...customer,
      address: createCustomerDto.address,
    };
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
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search?: string
  ) {
    return this.customerService.findAll();
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
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Cliente no encontrado",
  })
  async getCustomerOrders(@Param("id") id: string) {
    // This is temporarily commented out until we add this method
    // return this.customerService.getCustomerOrders(+id);
    throw new NotFoundException("Method not implemented");
  }
}
