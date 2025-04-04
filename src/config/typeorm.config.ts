import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

const isDevelopment = process.env.NODE_ENV === "development";

// Function to create the database if it doesn't exist
async function ensureDatabaseExists() {
  if (process.env.IS_DOCKER === 'true' && isDevelopment) {
    try {
      // First connect to master database
      const masterConnection = new DataSource({
        type: "mssql",
        host: process.env.DB_HOST || "sqlserver",
        port: parseInt(process.env.DB_PORT || '1433', 10),
        username: process.env.DB_USER || "sa",
        password: process.env.DB_PASSWORD || "YourStrong@Passw0rd",
        database: "master",
        extra: {
          trustServerCertificate: true
        }
      });

      await masterConnection.initialize();
      
      // Check if dermofarm database exists
      const dbName = process.env.DB_NAME || "dermofarm";
      const result = await masterConnection.query(
        `SELECT name FROM sys.databases WHERE name = '${dbName}'`
      );
      
      // Create database if it doesn't exist
      if (result.length === 0) {
        console.log(`Creating database '${dbName}'...`);
        await masterConnection.query(`CREATE DATABASE ${dbName}`);
        console.log(`Database '${dbName}' created successfully`);
      } else {
        console.log(`Database '${dbName}' already exists`);
      }
      
      await masterConnection.destroy();
    } catch (error) {
      console.error('Error ensuring database exists:', error);
    }
  }
}

// Try to create the database on module import
ensureDatabaseExists().catch(err => {
  console.error('Failed to ensure database exists:', err);
});

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
