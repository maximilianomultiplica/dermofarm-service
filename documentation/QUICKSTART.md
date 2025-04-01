# Guía Rápida - Servicio DERMOFARM

## 🚀 Inicio Rápido

### 1. Requisitos Previos
- Node.js v18 o superior
- SQL Server (producción) / SQLite (desarrollo)
- Acceso a la API de DERMOFARM

### 2. Configuración Inicial

1. Clonar el repositorio:
\`\`\`bash
git clone <repositorio>
cd dermofarm-service
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Copiar el archivo de configuración:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Configurar las variables de entorno en el archivo .env

### 3. Ejecutar la Aplicación

#### Desarrollo
\`\`\`bash
npm run start:dev
\`\`\`

#### Producción
\`\`\`bash
npm run build
npm run start:prod
\`\`\`

## 📘 Uso Básico

### 1. Autenticación

#### Login
\`\`\`bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password"}'
\`\`\`

### 2. Sincronización

#### Sincronización Manual
\`\`\`bash
curl -X POST http://localhost:3000/sync -H "Authorization: Bearer <token>"
\`\`\`

#### Sincronizar Productos
\`\`\`bash
curl -X POST http://localhost:3000/sync/products -H "Authorization: Bearer <token>"
\`\`\`

### 3. Gestión de Datos

#### Productos
- GET /products - Listar productos
- GET /products/:id - Obtener producto
- POST /products - Crear producto
- PATCH /products/:id - Actualizar producto
- DELETE /products/:id - Eliminar producto

#### Clientes
- GET /customers - Listar clientes
- GET /customers/:id - Obtener cliente
- POST /customers - Crear cliente
- PATCH /customers/:id - Actualizar cliente
- DELETE /customers/:id - Eliminar cliente

#### Órdenes
- GET /orders - Listar órdenes
- GET /orders/:id - Obtener orden
- POST /orders - Crear orden
- PATCH /orders/:id - Actualizar orden
- DELETE /orders/:id - Eliminar orden

## 🔒 Roles y Permisos

### Admin
- Acceso completo a todas las funcionalidades
- Gestión de usuarios
- Sincronización manual
- CRUD completo en todas las entidades

### Operator
- Visualización de datos
- Creación y actualización de órdenes
- Consulta de productos y clientes

## 🔍 Monitoreo

### Logs
Los logs se encuentran en:
- /logs/app.log - Logs generales
- /logs/error.log - Logs de errores
- /logs/sync.log - Logs de sincronización

### Swagger
Documentación de la API disponible en:
http://localhost:3000/api

## ⚠️ Solución de Problemas Comunes

### Error de Conexión a DERMOFARM
1. Verificar DERMOFARM_API_URL en .env
2. Comprobar conectividad de red
3. Validar DERMOFARM_API_KEY

### Error de Base de Datos
1. Verificar configuración en .env
2. Comprobar que la base de datos está activa
3. Validar permisos de usuario

### Error de Sincronización
1. Revisar logs en /logs/sync.log
2. Verificar estado de la API de DERMOFARM
3. Intentar sincronización manual

## 📞 Soporte

Para soporte técnico:
- Email: soporte@dermofarm.com
- Tel: +XX XXX XXX XXX

## 🔄 Actualizaciones

Para actualizar el sistema:
1. Detener el servicio
2. Hacer backup de la base de datos
3. Pull de los últimos cambios
4. Instalar dependencias
5. Ejecutar migraciones
6. Reiniciar el servicio
