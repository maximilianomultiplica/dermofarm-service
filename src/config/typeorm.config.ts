import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const isDevelopment = process.env.NODE_ENV === "development";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mssql",
  host: process.env.DB_HOST || "sql-ai.database.windows.net",
  port: parseInt(process.env.DB_PORT || '1433', 10),
  username: process.env.DB_USER || "ai_usr",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "dermofarm",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: isDevelopment,
  logging: isDevelopment,
  extra: {
    trustServerCertificate: true
  }
};
