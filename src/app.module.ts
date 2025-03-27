import { ConfigModule, ConfigService } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
// Entities
import { Customer } from "./entities/customer.entity";
// Controllers
import { CustomerController } from "./controllers/customer.controller";
// Services
import { CustomerService } from "./services/customer.service";
import { DermofarmService } from "./services/dermofarm.service";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { Order } from "./entities/order.entity";
import { OrderController } from "./controllers/order.controller";
import { OrderItem } from "./entities/order-item.entity";
import { OrderService } from "./services/order.service";
import { Product } from "./entities/product.entity";
import { ProductController } from "./controllers/product.controller";
import { ProductService } from "./services/product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Customer, Product, Order, OrderItem]),
    HttpModule.register({}),
  ],
  controllers: [
    AppController,
    CustomerController,
    ProductController,
    OrderController,
  ],
  providers: [
    AppService,
    CustomerService,
    ProductService,
    OrderService,
    DermofarmService,
  ],
})
export class AppModule {}
