import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DelegateSearchDto {
  @ApiProperty({ description: 'Número de teléfono del delegado' })
  @IsNotEmpty()
  @IsString()
  telefono: string;
}

export class DelegateResponseDto {
  @ApiProperty({ description: 'Nombre completo del delegado' })
  nombre_delegado: string;

  @ApiProperty({ description: 'Código del delegado (sector)' })
  codigo_delegado: string;

  @ApiProperty({ description: 'Número de teléfono móvil del delegado' })
  telefono_movil: string;
}

export class DelegateByNameSearchDto {
  @ApiProperty({ description: 'Nombre completo del delegado' })
  @IsNotEmpty()
  @IsString()
  nombre: string;
}

export class PharmacyDto {
  @ApiProperty({ description: 'Nombre de la farmacia' })
  nombre_farmacia: string;

  @ApiProperty({ description: 'Ciudad donde se encuentra la farmacia' })
  city: string;

  @ApiProperty({ description: 'Estado o provincia de la farmacia' })
  state: string;

  @ApiProperty({ description: 'Número de teléfono de la farmacia' })
  phone_number: string;
}

export class DelegateWithPharmaciesDto {
  @ApiProperty({ description: 'Nombre completo del delegado' })
  delegado: string;

  @ApiProperty({ description: 'Lista de farmacias asignadas al delegado', type: [PharmacyDto] })
  farmacias: PharmacyDto[];
}

export class PharmacyFinancialReportQueryDto {
  @ApiProperty({ description: 'Nombre completo del delegado' })
  @IsNotEmpty()
  @IsString()
  delegado: string;

  @ApiProperty({ description: 'Nombre de la farmacia' })
  @IsNotEmpty()
  @IsString()
  farmacia: string;
}

export class BrandFinancialDataDto {
  @ApiProperty({ description: 'Nombre de la marca' })
  marca: string;

  @ApiProperty({ description: 'Total de ventas para el año 2024' })
  total_2024: number;

  @ApiProperty({ description: 'Total de ventas para el año 2025' })
  total_2025: number;
}

export class PharmacyFinancialReportDto {
  @ApiProperty({ description: 'Nombre completo del delegado' })
  delegado: string;

  @ApiProperty({ description: 'Nombre de la farmacia' })
  farmacia: string;

  @ApiProperty({ description: 'Datos financieros por marca', type: [BrandFinancialDataDto] })
  marcas: BrandFinancialDataDto[];
}