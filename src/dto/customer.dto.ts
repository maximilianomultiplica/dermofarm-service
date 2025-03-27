import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class CreateCustomerDto {
  @ApiProperty({ description: "Nombre del cliente" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Email del cliente" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Teléfono del cliente" })
  @IsString()
  phone: string;

  @ApiProperty({ description: "Dirección del cliente" })
  @IsString()
  address: string;

  @ApiPropertyOptional({ description: "Notas adicionales" })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: "Nombre del cliente" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: "Email del cliente" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: "Teléfono del cliente" })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: "Dirección del cliente" })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: "Notas adicionales" })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CustomerResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
