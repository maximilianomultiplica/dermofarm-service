import { Controller, Get, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { DelegateService } from '../services/delegate.service';
import { 
  DelegateResponseDto, 
  DelegateWithPharmaciesDto,
  PharmacyFinancialReportDto 
} from '../dto/delegate.dto';

@ApiTags('delegados')
@Controller('delegados')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DelegateController {
  constructor(private readonly delegateService: DelegateService) {}

  @Get('buscar/por-telefono')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Buscar un delegado por número de teléfono' })
  @ApiQuery({ name: 'telefono', description: 'Número de teléfono del delegado', type: 'string', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delegado encontrado exitosamente',
    type: DelegateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Delegado no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findByPhoneNumber(@Query('telefono') telefono: string): Promise<DelegateResponseDto> {
    return this.delegateService.findByPhoneNumber(telefono);
  }

  @Get('buscar/con-farmacias')
  @Roles('admin', 'operator')
  @ApiOperation({ summary: 'Buscar un delegado por nombre y ver sus farmacias asignadas' })
  @ApiQuery({ name: 'nombre', description: 'Nombre completo del delegado', type: 'string', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delegado y sus farmacias encontradas exitosamente',
    type: DelegateWithPharmaciesDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Delegado no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findByNameWithPharmacies(@Query('nombre') nombre: string): Promise<DelegateWithPharmaciesDto> {
    return this.delegateService.findByNameWithPharmacies(nombre);
  }

  @Get('informe-financiero')
  @Roles('admin', 'financial', 'operator')
  @ApiOperation({ summary: 'Obtener informe financiero de una farmacia para un delegado específico' })
  @ApiQuery({ name: 'delegado', description: 'Nombre completo del delegado', type: 'string', required: true })
  @ApiQuery({ name: 'farmacia', description: 'Nombre de la farmacia', type: 'string', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Informe financiero generado exitosamente',
    type: PharmacyFinancialReportDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No se encontraron datos financieros para el delegado y la farmacia especificados',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async getPharmacyFinancialReport(
    @Query('delegado') delegado: string,
    @Query('farmacia') farmacia: string,
  ): Promise<PharmacyFinancialReportDto> {
    return this.delegateService.getPharmacyFinancialReport(delegado, farmacia);
  }
}