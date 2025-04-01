import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DermofarmService } from '../../../services/dermofarm.service';
import { ProductsService } from '../../products/services/products.service';
import { CustomersService } from '../../customers/services/customers.service';
import { OrdersService } from '../../orders/services/orders.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger('SyncService');

  constructor(
    private configService: ConfigService,
    private dermofarmService: DermofarmService,
    private productsService: ProductsService,
    private customersService: CustomersService,
    private ordersService: OrdersService,
  ) {}

  // Sincronización automática cada 30 minutos
  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleAutomaticSync() {
    this.logger.log('Iniciando sincronización automática...');
    await this.syncAll();
  }

  // Sincronización manual
  async syncAll() {
    try {
      // Sincronizar productos
      this.logger.log('Sincronizando productos...');
      const products = await this.dermofarmService.getProducts();
      await this.productsService.syncProducts(products);

      // Sincronizar clientes
      this.logger.log('Sincronizando clientes...');
      const customers = await this.dermofarmService.getCustomers();
      await this.customersService.syncCustomers(customers);

      // Sincronizar órdenes
      this.logger.log('Sincronizando órdenes...');
      const orders = await this.dermofarmService.getOrders();
      await this.ordersService.syncOrders(orders);

      this.logger.log('Sincronización completada exitosamente');
      return {
        success: true,
        message: 'Sincronización completada exitosamente',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Error durante la sincronización:', error);
      throw error;
    }
  }

  // Sincronización de productos
  async syncProducts() {
    try {
      this.logger.log('Sincronizando productos...');
      const products = await this.dermofarmService.getProducts();
      const syncedProducts = await this.productsService.syncProducts(products);
      return {
        success: true,
        message: 'Productos sincronizados exitosamente',
        data: syncedProducts,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Error sincronizando productos:', error);
      throw error;
    }
  }

  // Sincronización de clientes
  async syncCustomers() {
    try {
      this.logger.log('Sincronizando clientes...');
      const customers = await this.dermofarmService.getCustomers();
      const syncedCustomers = await this.customersService.syncCustomers(customers);
      return {
        success: true,
        message: 'Clientes sincronizados exitosamente',
        data: syncedCustomers,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Error sincronizando clientes:', error);
      throw error;
    }
  }

  // Sincronización de órdenes
  async syncOrders() {
    try {
      this.logger.log('Sincronizando órdenes...');
      const orders = await this.dermofarmService.getOrders();
      const syncedOrders = await this.ordersService.syncOrders(orders);
      return {
        success: true,
        message: 'Órdenes sincronizadas exitosamente',
        data: syncedOrders,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Error sincronizando órdenes:', error);
      throw error;
    }
  }
}