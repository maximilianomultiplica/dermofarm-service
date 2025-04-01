import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";

export enum UserRole {
  ADMIN = "admin",
  OPERATOR = "operator"
}

export class LoginDto {
  @ApiProperty({ description: "Email del usuario", example: "admin@dermofarm.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "Contraseña del usuario", example: "password123" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: "Nombre del usuario", example: "Admin" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Email del usuario", example: "admin@dermofarm.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "Contraseña del usuario", example: "password123" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: "Rol del usuario", enum: UserRole, example: UserRole.ADMIN })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

export class TokenResponseDto {
  @ApiProperty({ description: "Token de acceso" })
  accessToken: string;

  @ApiProperty({ description: "Tipo de token", example: "Bearer" })
  tokenType: string;

  @ApiProperty({ description: "Tiempo de expiración en segundos", example: 3600 })
  expiresIn: number;
}

export class UserResponseDto {
  @ApiProperty({ description: "ID del usuario" })
  id: number;

  @ApiProperty({ description: "Nombre del usuario" })
  name: string;

  @ApiProperty({ description: "Email del usuario" })
  email: string;

  @ApiProperty({ description: "Rol del usuario", enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: "Fecha de creación" })
  createdAt: Date;
}