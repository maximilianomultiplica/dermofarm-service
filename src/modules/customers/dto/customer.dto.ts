import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsInt, IsOptional, IsPhoneNumber, IsString } from "class-validator";

// DTO para crear un cliente
export class CreateCustomerDto {
  @ApiProperty({ description: "ID del cliente en DERMOFARM" })
  @IsInt()
  dermofarmId: number;

  @ApiProperty({ description: "Nombre del cliente" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Email del cliente" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Teléfono del cliente" })
  @IsPhoneNumber()
  phone: string;
}

// DTO para actualizar un cliente
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
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;
}

// DTO para respuesta de cliente
export class CustomerResponseDto {
  @ApiProperty({ description: "ID del cliente" })
  id: number;

  @ApiProperty({ description: "ID del cliente en DERMOFARM" })
  dermofarmId: number;

  @ApiProperty({ description: "Nombre del cliente" })
  name: string;

  @ApiProperty({ description: "Email del cliente" })
  email: string;

  @ApiProperty({ description: "Teléfono del cliente" })
  phone: string;

  @ApiProperty({ description: "Fecha de última sincronización" })
  lastSync: Date;

  @ApiProperty({ description: "Fecha de creación" })
  createdAt: Date;

  @ApiProperty({ description: "Fecha de última actualización" })
  updatedAt: Date;
}