import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

// DTO para crear un producto
export class CreateProductDto {
  @ApiProperty({ description: "ID del producto en DERMOFARM" })
  @IsInt()
  dermofarmId: number;

  @ApiProperty({ description: "Nombre del producto" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Descripción del producto" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "Precio del producto" })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: "Stock disponible" })
  @IsInt()
  @Min(0)
  stock: number;
}

// DTO para actualizar un producto
export class UpdateProductDto {
  @ApiPropertyOptional({ description: "Nombre del producto" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: "Descripción del producto" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: "Precio del producto" })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: "Stock disponible" })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;
}

// DTO para respuesta de producto
export class ProductResponseDto {
  @ApiProperty({ description: "ID del producto" })
  id: number;

  @ApiProperty({ description: "ID del producto en DERMOFARM" })
  dermofarmId: number;

  @ApiProperty({ description: "Nombre del producto" })
  name: string;

  @ApiProperty({ description: "Descripción del producto" })
  description: string;

  @ApiProperty({ description: "Precio del producto" })
  price: number;

  @ApiProperty({ description: "Stock disponible" })
  stock: number;

  @ApiProperty({ description: "Fecha de última sincronización" })
  lastSync: Date;

  @ApiProperty({ description: "Fecha de creación" })
  createdAt: Date;

  @ApiProperty({ description: "Fecha de última actualización" })
  updatedAt: Date;
}