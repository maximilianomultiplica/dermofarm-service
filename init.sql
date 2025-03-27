-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'dermofarm')
BEGIN
    CREATE DATABASE dermofarm;
END
GO

USE dermofarm;
GO

-- Comentario: Verificar que el esquema dbo existe
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'dbo')
BEGIN
    EXEC('CREATE SCHEMA dbo')
END
GO

-- Las tablas serán creadas automáticamente por TypeORM en desarrollo
-- ya que hemos configurado synchronize: true

-- Si estuviéramos en producción, necesitaríamos crear manualmente las tablas aquí