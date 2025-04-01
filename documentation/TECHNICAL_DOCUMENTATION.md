# Documentación Técnica - Servicio DERMOFARM

## 1. Arquitectura del Sistema

### 1.1 Visión General

El servicio DERMOFARM está construido como una aplicación NestJS que actúa como middleware de integración entre la base de datos de DERMOFARM y el sistema del agente. La arquitectura sigue un diseño modular con una clara separación de responsabilidades.

### 1.2 Stack Tecnológico

- **Runtime**: Node.js v18+
- **Framework**: NestJS v10
- **Lenguaje**: TypeScript
- **Base de Datos**: SQL Server (Producción), SQLite (Desarrollo)
- **ORM**: TypeORM
- **Autenticación**: JWT + Passport
- **Documentación API**: Swagger/OpenAPI
- **Seguridad**: Helmet, CORS
- **Sincronización**: Tareas programadas con @nestjs/schedule

## 2. Estructura del Proyecto

```
src/
├── config/              # Configuraciones del sistema
├── modules/            # Módulos principales
│   ├── auth/          # Autenticación y autorización
│   ├── products/      # Gestión de productos
│   ├── customers/     # Gestión de clientes
│   ├── orders/        # Gestión de órdenes
│   └── sync/          # Sincronización con DERMOFARM
├── services/           # Servicios compartidos
└── utils/             # Utilidades y helpers
```

## 3. Módulos Principales

### 3.1 Módulo de Autenticación (auth)
- Autenticación mediante JWT
- Sistema de roles (admin, operator)
- Protección de rutas
- Registro y login de usuarios

### 3.2 Módulo de Productos (products)
- CRUD de productos
- Sincronización con catálogo DERMOFARM
- Gestión de stock
- Historial de cambios

### 3.3 Módulo de Clientes (customers)
- CRUD de clientes
- Vinculación con DERMOFARM
- Historial de órdenes
- Datos de contacto

### 3.4 Módulo de Órdenes (orders)
- Gestión de pedidos
- Items de orden
- Estados de pedido
- Sincronización bidireccional

### 3.5 Módulo de Sincronización (sync)
- Sincronización automática cada 30 minutos
- Sincronización manual por demanda
- Registro de sincronización
- Manejo de errores

## 4. Seguridad

### 4.1 Autenticación
- JWT para tokens de acceso
- Validación de tokens
- Refresh tokens
- Almacenamiento seguro de contraseñas

### 4.2 Autorización
- Control de acceso basado en roles
- Protección de rutas sensibles
- Middleware de autorización
- Validación de permisos

## 5. Base de Datos

### 5.1 Entidades Principales
- User (auth)
- Product (products)
- Customer (customers)
- Order (orders)
- OrderItem (orders)

### 5.2 Configuración
- Múltiples entornos (desarrollo, producción)
- Migraciones automáticas en desarrollo
- Sincronización manual en producción
- Backups y recuperación

## 6. API REST

### 6.1 Endpoints Principales
- /auth - Autenticación y gestión de usuarios
- /products - Gestión de productos
- /customers - Gestión de clientes
- /orders - Gestión de órdenes
- /sync - Control de sincronización

### 6.2 Documentación
- Swagger UI disponible en /api
- Descripción detallada de endpoints
- Ejemplos de solicitudes
- Esquemas de respuesta

## 7. Despliegue

### 7.1 Requisitos
- Node.js v18+
- SQL Server (producción)
- Variables de entorno configuradas
- Permisos de red para DERMOFARM API

### 7.2 Proceso
1. Instalación de dependencias
2. Configuración de variables de entorno
3. Compilación del proyecto
4. Inicio del servidor
5. Verificación de sincronización

## 8. Mantenimiento

### 8.1 Logs
- Logs de aplicación
- Logs de sincronización
- Logs de errores
- Rotación de logs

### 8.2 Monitoreo
- Estado de sincronización
- Rendimiento de API
- Uso de recursos
- Alertas y notificaciones

## 9. Solución de Problemas

### 9.1 Problemas Comunes
- Errores de sincronización
- Problemas de conexión
- Errores de autenticación
- Conflictos de datos

### 9.2 Procedimientos
1. Verificar logs
2. Comprobar conexiones
3. Validar configuración
4. Resincronizar datos

## 10. Contribución

### 10.1 Guías
- Estilo de código
- Proceso de revisión
- Tests requeridos
- Documentación necesaria

### 10.2 Flujo de Trabajo
1. Crear rama feature/fix
2. Implementar cambios
3. Pruebas unitarias
4. Pull Request
5. Code Review
6. Merge a main
