# Guía de Inicio Rápido - DERMOFARM Service

## 1. Requisitos Previos

- Node.js 18.x o superior
- Docker y Docker Compose
- SQL Server 2022 (incluido en Docker)

## 2. Configuración Inicial

### 2.1 Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd dermofarm-srv
```

### 2.2 Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
DB_HOST=sqlserver
DB_PORT=1433
DB_NAME=dermofarm
DB_USER=sa
DB_PASSWORD=YourStrong@Passw0rd
DERMOFARM_API_URL=http://localhost:8080/api
```

### 2.3 Instalar Dependencias

```bash
npm install
```

## 3. Iniciar el Proyecto

### 3.1 Desarrollo Local

1. Iniciar los servicios con Docker Compose:

```bash
docker-compose up -d
```

2. Verificar que los servicios estén corriendo:

```bash
docker-compose ps
```

3. Acceder a la documentación de la API:
   - Swagger UI: http://localhost:3000/api

### 3.2 Producción

1. Construir las imágenes:

```bash
docker-compose -f deploy/docker-compose.prod.yml build
```

2. Iniciar los servicios:

```bash
docker-compose -f deploy/docker-compose.prod.yml up -d
```

## 4. Verificación

### 4.1 Verificar Servicios

- API: http://localhost:3000
- SQL Server: localhost:1433

### 4.2 Verificar Logs

```bash
# Ver logs de la API
docker-compose logs -f api

# Ver logs de SQL Server
docker-compose logs -f sqlserver
```

## 5. Comandos Útiles

### 5.1 Desarrollo

```bash
# Iniciar en modo desarrollo
npm run start:dev

# Construir el proyecto
npm run build

# Ejecutar tests
npm run test

# Linting
npm run lint
```

### 5.2 Docker

```bash
# Detener servicios
docker-compose down

# Reconstruir servicios
docker-compose up --build

# Ver logs
docker-compose logs -f

# Acceder a la consola de SQL Server
docker-compose exec sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd
```

## 6. Solución de Problemas

### 6.1 Problemas Comunes

1. **Error de conexión a la base de datos**

   - Verificar que SQL Server esté corriendo
   - Verificar credenciales en .env
   - Verificar puertos expuestos

2. **Error de sincronización con DERMOFARM**

   - Verificar URL de la API en .env
   - Verificar conectividad
   - Revisar logs de la API

3. **Error de permisos**
   - Verificar roles de usuario
   - Verificar tokens JWT
   - Revisar logs de autenticación

### 6.2 Recursos Adicionales

- [Documentación Técnica](TECHNICAL.md)
- [Documentación Funcional](FUNCTIONAL.md)
- [Documentación de la API](API.md)
