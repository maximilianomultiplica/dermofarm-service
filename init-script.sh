#\!/bin/sh
npm install sqlite3 --save
cat > /app/src/config/typeorm.config.ts << EOL
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

// For development (Docker), let's use SQLite instead while the SQL Server is being configured
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "sqlite",
  database: "dermofarm-dev.sqlite",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: true, // Auto-create database schema in development
  logging: true,
};
EOL

npm run start:dev

