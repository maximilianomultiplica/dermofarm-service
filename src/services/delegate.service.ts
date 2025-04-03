import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DelegateEntity } from '../entities/delegate.entity';
import { 
  DelegateResponseDto, 
  DelegateWithPharmaciesDto, 
  PharmacyDto,
  PharmacyFinancialReportDto,
  BrandFinancialDataDto
} from '../dto/delegate.dto';

@Injectable()
export class DelegateService {
  constructor(
    @InjectRepository(DelegateEntity)
    private delegateRepository: Repository<DelegateEntity>,
    private entityManager: EntityManager,
  ) {}

  /**
   * Busca un delegado por su número de teléfono utilizando un procedimiento almacenado
   * @param telefono Número de teléfono del delegado
   * @returns Información del delegado encontrado
   */
  async findByPhoneNumber(telefono: string): Promise<DelegateResponseDto> {
    // Ejecutar el procedimiento almacenado
    const result = await this.entityManager.query(
      'EXEC buscar_delegado_por_telefono @telefono = @0',
      [telefono]
    );

    // Verificar si se encontró algún resultado
    if (!result || result.length === 0) {
      throw new NotFoundException(`No se encontró ningún delegado con el número de teléfono ${telefono}`);
    }

    // Devolver el primer resultado (debería ser único)
    return result[0] as DelegateResponseDto;
  }

  /**
   * Busca un delegado por su nombre completo y devuelve las farmacias asignadas
   * @param nombre Nombre completo del delegado
   * @returns Información del delegado con sus farmacias asignadas
   */
  async findByNameWithPharmacies(nombre: string): Promise<DelegateWithPharmaciesDto> {
    // Ejecutar la consulta SQL para obtener el delegado y sus farmacias
    const results = await this.entityManager.query(`
      SELECT 
        dp.full_name AS delegado,
        ph.name AS nombre_farmacia,
        ph.city,
        ph.state,
        ph.phone_number
      FROM delegate_profile dp
      JOIN delegate_pharmacy dph ON dph.delegate_sector = dp.sector
      JOIN pharmacies ph ON ph.code = dph.pharmacy_code
      WHERE dp.full_name = @0
      ORDER BY ph.name
    `, [nombre]);

    // Verificar si se encontró algún resultado
    if (!results || results.length === 0) {
      throw new NotFoundException(`No se encontró ningún delegado con el nombre ${nombre}`);
    }

    // Transformar los resultados a la estructura que necesitamos
    const delegadoNombre = results[0].delegado;
    const farmacias = results.map((item: { nombre_farmacia: string; city: string; state: string; phone_number: string }) => ({
      nombre_farmacia: item.nombre_farmacia,
      city: item.city,
      state: item.state,
      phone_number: item.phone_number
    } as PharmacyDto));

    return {
      delegado: delegadoNombre,
      farmacias: farmacias
    };
  }

  /**
   * Genera un informe financiero de una farmacia específica para un delegado
   * @param delegadoNombre Nombre completo del delegado
   * @param farmaciaNombre Nombre de la farmacia
   * @returns Informe financiero con desglose por marcas
   */
  async getPharmacyFinancialReport(delegadoNombre: string, farmaciaNombre: string): Promise<PharmacyFinancialReportDto> {
    // Consulta SQL para obtener los datos financieros
    const results = await this.entityManager.query(`
      SELECT
        dp.full_name AS delegado,
        p.name AS farmacia,
        b.name AS marca,
        SUM(CASE 
            WHEN YEAR(pb.order_date) = 2024 AND pb.order_date <= GETDATE() THEN pb.total_amount 
            ELSE 0 
        END) AS total_2024,
        SUM(CASE 
            WHEN YEAR(pb.order_date) = 2025 AND pb.order_date <= GETDATE() THEN pb.total_amount 
            ELSE 0 
        END) AS total_2025
      FROM pharmacy_billing pb
      JOIN pharmacies p ON p.code = pb.pharmacy_code
      JOIN brands b ON b.code = pb.brand_code
      JOIN delegate_profile dp ON dp.sector = pb.delegate_sector
      JOIN delegate_pharmacy dph ON dph.delegate_sector = dp.sector AND dph.pharmacy_code = p.code
      WHERE 
        dp.full_name = @0
        AND p.name = @1
      GROUP BY dp.full_name, p.name, b.name
      ORDER BY b.name
    `, [delegadoNombre, farmaciaNombre]);

    // Verificar si se encontraron resultados
    if (!results || results.length === 0) {
      throw new NotFoundException(`No se encontraron datos financieros para el delegado ${delegadoNombre} y la farmacia ${farmaciaNombre}`);
    }

    // Transformar los resultados al formato requerido
    const marcas = results.map((item: { marca: any; total_2024: string; total_2025: string; }) => ({
      marca: item.marca,
      total_2024: parseFloat(item.total_2024) || 0,
      total_2025: parseFloat(item.total_2025) || 0
    } as BrandFinancialDataDto));

    return {
      delegado: results[0].delegado,
      farmacia: results[0].farmacia,
      marcas: marcas
    };
  }
}