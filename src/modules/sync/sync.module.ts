import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncController } from './controllers/sync.controller';
import { SyncService } from './services/sync.service';
import { DermofarmService } from '../../services/dermofarm.service';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProductsModule,
    CustomersModule,
    OrdersModule,
  ],
  controllers: [SyncController],
  providers: [SyncService, DermofarmService],
  exports: [SyncService],
})
export class SyncModule {}