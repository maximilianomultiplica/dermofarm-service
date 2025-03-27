import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// Configure database based on environment
const isDevelopment = process.env.NODE_ENV === "development";
const isDocker = process.env.IS_DOCKER === "true";

console.log("Database Configuration:", {
  isDevelopment,
  isDocker,
  dbType: "mssql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  database: process.env.DB_NAME
});

// Usar un enfoque en memoria para minimizar problemas de desarrollo
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "sqljs",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: true, // Auto-create database schema in development
  logging: true,
  autoSave: false
};
