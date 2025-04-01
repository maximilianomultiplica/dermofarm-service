import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CreateProductDto } from '../modules/products/dto/product.dto';
import { CreateCustomerDto } from '../modules/customers/dto/customer.dto';
import { CreateOrderDto } from '../modules/orders/dto/order.dto';

@Injectable()
export class DermofarmService {
  private readonly logger = new Logger('DermofarmService');
  private readonly apiClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    const apiUrl = this.configService.get<string>('DERMOFARM_API_URL');
    
    if (!apiUrl) {
      this.logger.error('DERMOFARM_API_URL no está configurada');
    }
    
    this.apiClient = axios.create({
      baseURL: apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Obtener productos desde DERMOFARM
   */
  async getProducts(): Promise<CreateProductDto[]> {
    try {
      const response = await this.apiClient.get('/products');
      return response.data;
    } catch (error) {
      this.handleApiError('Error al obtener productos de DERMOFARM', error);
      return [];
    }
  }

  /**
   * Obtener clientes desde DERMOFARM
   */
  async getCustomers(): Promise<CreateCustomerDto[]> {
    try {
      const response = await this.apiClient.get('/customers');
      return response.data;
    } catch (error) {
      this.handleApiError('Error al obtener clientes de DERMOFARM', error);
      return [];
    }
  }

  /**
   * Obtener órdenes desde DERMOFARM
   */
  async getOrders(): Promise<CreateOrderDto[]> {
    try {
      const response = await this.apiClient.get('/orders');
      return response.data;
    } catch (error) {
      this.handleApiError('Error al obtener órdenes de DERMOFARM', error);
      return [];
    }
  }

  /**
   * Enviar una orden a DERMOFARM
   */
  async sendOrder(order: CreateOrderDto): Promise<any> {
    try {
      const response = await this.apiClient.post('/orders', order);
      return response.data;
    } catch (error) {
      this.handleApiError('Error al enviar la orden a DERMOFARM', error);
      throw new HttpException(
        'Error al enviar la orden a DERMOFARM',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Actualizar el estado de una orden en DERMOFARM
   */
  async updateOrderStatus(orderId: number, status: string): Promise<any> {
    try {
      const response = await this.apiClient.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      this.handleApiError(`Error al actualizar el estado de la orden ${orderId} en DERMOFARM`, error);
      throw new HttpException(
        'Error al actualizar el estado de la orden',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Manejar errores de la API de DERMOFARM
   */
  private handleApiError(message: string, error: any): void {
    if (error.response) {
      // La API respondió con un código de error
      this.logger.error(`${message}: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      this.logger.error(`${message}: No se recibió respuesta`);
    } else {
      // Error en la configuración de la solicitud
      this.logger.error(`${message}: ${error.message}`);
    }
  }
}
