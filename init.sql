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

-- Crear el usuario 'sa' si no existe
IF NOT EXISTS (SELECT * FROM sys.sql_logins WHERE name = 'sa')
BEGIN
    CREATE LOGIN sa WITH PASSWORD = 'YourStrong@Passw0rd', CHECK_POLICY = OFF;
    ALTER LOGIN sa ENABLE;
END
GO

-- Asignar permisos al usuario 'sa'
ALTER SERVER ROLE sysadmin ADD MEMBER sa;
GO

USE dermofarm;
GO

-- Crear usuario asociado en la base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'sa')
BEGIN
    CREATE USER sa FOR LOGIN sa;
    ALTER ROLE db_owner ADD MEMBER sa;
END
GO

-- Las tablas serán creadas automáticamente por TypeORM en desarrollo
-- ya que hemos configurado synchronize: true

-- Si estuviéramos en producción, necesitaríamos crear manualmente las tablas aquí
