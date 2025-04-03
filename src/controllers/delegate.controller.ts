import { Controller, Get, Query } from '@nestjs/common';
import { DelegateService } from '../services/delegate.service';
import { 
  DelegateResponseDto, 
  DelegateWithPharmaciesDto,
  PharmacyFinancialReportDto 
} from '../dto/delegate.dto';

@Controller('delegados')
export class DelegateController {
  constructor(private readonly delegateService: DelegateService) {}

  @Get('buscar/por-telefono')
  async findByPhoneNumber(@Query('telefono') telefono: string): Promise<DelegateResponseDto> {
    return this.delegateService.findByPhoneNumber(telefono);
  }

  @Get('buscar/con-farmacias')
  async findByNameWithPharmacies(@Query('nombre') nombre: string): Promise<DelegateWithPharmaciesDto> {
    return this.delegateService.findByNameWithPharmacies(nombre);
  }

  @Get('informe-financiero')
  async getPharmacyFinancialReport(
    @Query('delegado') delegado: string,
    @Query('farmacia') farmacia: string,
  ): Promise<PharmacyFinancialReportDto> {
    return this.delegateService.getPharmacyFinancialReport(delegado, farmacia);
  }
}