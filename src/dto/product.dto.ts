import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({ description: "SKU del producto" })
  @IsString()
  sku: string;

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

  @ApiPropertyOptional({ description: "Indica si el producto está activo" })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ description: "SKU del producto" })
  @IsString()
  @IsOptional()
  sku?: string;

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

  @ApiPropertyOptional({ description: "Indica si el producto está activo" })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ProductResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
