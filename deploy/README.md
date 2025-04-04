# Guía de Despliegue en Producción - DERMOFARM Service

## 1. Requisitos Previos

### 1.1 Servidor

- Docker 20.10 o superior
- Docker Compose 2.0 o superior
- Git
- Mínimo 2GB de RAM disponible
- 20GB de espacio en disco

### 1.2 Base de Datos

- Acceso de solo lectura a la instancia de SQL Server del cliente
- Credenciales de base de datos proporcionadas por el cliente
- Puerto 1433 abierto (o el puerto configurado)
- La base de datos es administrada y mantenida por el cliente

### 1.3 Red

- Puerto 3000 abierto para la API
- Acceso a la API del Agente
- Firewall configurado según necesidades
- Acceso a la red de la base de datos del cliente

## 2. Preparación del Entorno

### 2.1 Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd dermofarm-srv
```

### 2.2 Configurar Variables de Entorno

1. Copiar el archivo de ejemplo:

```bash
cd deploy
cp .env.prod.example .env.prod
```

2. Editar el archivo `.env.prod` con los valores reales:

```bash
nano .env.prod
```

> **Nota:** El script de despliegue `deploy.sh` creará automáticamente el archivo `.env.prod` a partir de `.env.prod.example` si no existe.

3. Variables requeridas:

```env
# Entorno
NODE_ENV=production
PORT=3000

# Base de Datos (proporcionada por el cliente)
DB_HOST=your-sql-server-host
DB_PORT=1433
DB_NAME=dermofarm
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# API del Agente
AGENT_API_URL=https://your-agent-api-url
AGENT_API_KEY=your-agent-api-key

# JWT
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRATION=1h
```

## 3. Proceso de Despliegue

### 3.1 Despliegue Automático

1. Dar permisos de ejecución al script:

```bash
chmod +x deploy.sh
```

2. Ejecutar el script de despliegue:

```bash
./deploy.sh
```

El script realizará:

- Verificación del archivo .env.prod
- Detención de contenedores existentes
- Construcción de la imagen
- Inicio de servicios
- Verificación de estado
- Visualización de logs

### 3.2 Despliegue Manual

Si es necesario realizar el despliegue manualmente:

1. Detener contenedores existentes:

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml down
```

2. Construir la imagen:

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml build --no-cache
```

3. Iniciar servicios:

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

4. Verificar estado:

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml ps
```

5. Verificar logs:

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml logs -f
```

## 4. Verificación del Despliegue

### 4.1 Verificar Servicios

```bash
# Ver estado de contenedores
docker-compose --env-file .env.prod -f docker-compose.prod.yml ps

# Ver logs en tiempo real
docker-compose --env-file .env.prod -f docker-compose.prod.yml logs -f

# Verificar health check
curl http://localhost:3000/api
```

### 4.2 Verificar Conexión a Base de Datos

```bash
# Entrar al contenedor
docker exec -it dermofarm-api-prod sh

# Verificar conexión de solo lectura a base de datos
node -e "const { Client } = require('mssql'); const config = require('./src/config/typeorm.config'); new Client(config).connect().then(() => console.log('Conexión exitosa')).catch(console.error);"
```

## 5. Mantenimiento

### 5.1 Actualización de la Aplicación

1. Detener servicios:

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml down
```

2. Actualizar código:

```bash
git pull origin main
```

3. Reconstruir y reiniciar:

```bash
./deploy.sh
```

### 5.2 Limpieza de Recursos

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar volúmenes no utilizados
docker volume prune
```

### 5.3 Monitoreo de Logs

```bash
# Ver logs en tiempo real
docker-compose --env-file .env.prod -f docker-compose.prod.yml logs -f

# Ver últimos 100 logs
docker-compose --env-file .env.prod -f docker-compose.prod.yml logs --tail=100
```

## 6. Solución de Problemas

### 6.1 Problemas Comunes

1. **Error de Conexión a Base de Datos**

   - Verificar credenciales en .env.prod
   - Confirmar que SQL Server está accesible
   - Verificar firewall y puertos
   - Contactar al cliente si hay problemas de acceso

2. **Error de Puerto en Uso**

   ```bash
   # Verificar proceso usando el puerto
   lsof -i :3000
   # Detener el proceso si es necesario
   kill -9 <PID>
   ```

3. **Error de Memoria**
   - Verificar uso de memoria: `free -m`
   - Ajustar límites de Docker si es necesario
   - Considerar aumentar RAM del servidor

### 6.2 Logs y Diagnóstico

```bash
# Ver logs de la aplicación
docker-compose --env-file .env.prod -f docker-compose.prod.yml logs api

# Ver logs del sistema
journalctl -u docker

# Ver uso de recursos
docker stats
```

## 7. Seguridad

### 7.1 Consideraciones de Seguridad

- Mantener .env.prod seguro y no compartirlo
- Usar contraseñas fuertes
- Mantener Docker y dependencias actualizadas
- Configurar firewall adecuadamente
- No intentar modificar la base de datos del cliente
- Seguir las políticas de seguridad del cliente

### 7.2 Backups

```bash
# Backup de variables de entorno
cp .env.prod .env.prod.backup
```

## 8. Recursos Adicionales

- [Documentación Técnica](../documentation/TECHNICAL.md)
- [Documentación Funcional](../documentation/FUNCTIONAL.md)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server/)

Para desarrollo, se ven los logs
```bash
sudo docker-compose --env-file .env.prod -p agent2 -f docker-compose.prod.yml up
```

Para dejar andando productivo
```bash
sudo docker-compose --env-file .env.prod -p agent2 -f docker-compose.prod.yml up -d
```
