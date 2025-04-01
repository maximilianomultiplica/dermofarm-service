import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { 
  IsArray, 
  IsEnum, 
  IsInt, 
  IsNumber, 
  IsObject, 
  IsOptional, 
  Min, 
  ValidateNested 
} from "class-validator";

// Enum para estados de órdenes
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

// DTO para items de orden
export class OrderItemDto {
  @ApiProperty({ description: "ID del producto" })
  @IsInt()
  productId: number;

  @ApiProperty({ description: "Cantidad" })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: "Precio unitario" })
  @IsNumber()
  @Min(0)
  price: number;
}

// DTO para crear una orden
export class CreateOrderDto {
  @ApiProperty({ description: "ID de la orden en DERMOFARM" })
  @IsInt()
  dermofarmId: number;

  @ApiProperty({ description: "ID del cliente" })
  @IsInt()
  customerId: number;

  @ApiProperty({ description: "Items de la orden", type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ description: "Total de la orden" })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ description: "Estado de la orden", enum: OrderStatus, default: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus = OrderStatus.PENDING;
}

// DTO para actualizar una orden
export class UpdateOrderDto {
  @ApiPropertyOptional({ description: "Estado de la orden", enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({ description: "Items de la orden", type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsOptional()
  items?: OrderItemDto[];

  @ApiPropertyOptional({ description: "Total de la orden" })
  @IsNumber()
  @Min(0)
  @IsOptional()
  total?: number;
}

// DTO para la respuesta de una orden
export class OrderItemResponseDto {
  @ApiProperty({ description: "ID del item" })
  id: number;

  @ApiProperty({ description: "ID del producto" })
  productId: number;

  @ApiProperty({ description: "Nombre del producto" })
  productName: string;

  @ApiProperty({ description: "Cantidad" })
  quantity: number;

  @ApiProperty({ description: "Precio unitario" })
  price: number;
}

export class OrderResponseDto {
  @ApiProperty({ description: "ID de la orden" })
  id: number;

  @ApiProperty({ description: "ID de la orden en DERMOFARM" })
  dermofarmId: number;

  @ApiProperty({ description: "ID del cliente" })
  customerId: number;

  @ApiProperty({ description: "Nombre del cliente" })
  customerName: string;

  @ApiProperty({ description: "Items de la orden", type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ description: "Total de la orden" })
  total: number;

  @ApiProperty({ description: "Estado de la orden", enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ description: "Fecha de última sincronización" })
  lastSync: Date;

  @ApiProperty({ description: "Fecha de creación" })
  createdAt: Date;

  @ApiProperty({ description: "Fecha de última actualización" })
  updatedAt: Date;
}