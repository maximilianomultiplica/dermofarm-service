import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { winstonConfig } from './config/logger.config';
import { DermofarmService } from './services/dermofarm.service';

// Importar los módulos core de Dermofarm
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CustomersModule } from './modules/customers/customers.module';
import { AuthModule } from './modules/auth/auth.module';
import { SyncModule } from './modules/sync/sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    TypeOrmModule.forRoot(typeOrmConfig),
    // Registrar los módulos core de Dermofarm
    ProductsModule,
    OrdersModule,
    CustomersModule,
    AuthModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [AppService, DermofarmService],
  exports: [DermofarmService],
})
export class AppModule {}
