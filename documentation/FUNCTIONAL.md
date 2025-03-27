# Documentación Funcional - DERMOFARM Service

## 1. Descripción General

El servicio DERMOFARM es una aplicación backend que actúa como un agente de sincronización y gestión de datos entre un sistema local y la API de DERMOFARM. El sistema proporciona una interfaz REST para gestionar productos, órdenes y clientes, manteniendo la sincronización con el sistema principal de DERMOFARM.

## 2. Funcionalidades Principales

### 2.1 Gestión de Productos

- Creación de productos
- Actualización de información de productos
- Consulta de productos
- Eliminación de productos
- Sincronización automática con DERMOFARM
- Control de stock

### 2.2 Gestión de Órdenes

- Creación de órdenes
- Actualización de estado de órdenes
- Consulta de órdenes
- Eliminación de órdenes
- Sincronización automática con DERMOFARM
- Gestión de items de orden
- Seguimiento de estado

### 2.3 Gestión de Clientes

- Creación de clientes
- Actualización de información de clientes
- Consulta de clientes
- Eliminación de clientes
- Sincronización automática con DERMOFARM
- Historial de órdenes por cliente

## 3. Flujos de Negocio

### 3.1 Proceso de Creación de Orden

1. Validación de cliente
2. Validación de productos y stock
3. Cálculo de total
4. Creación de orden
5. Actualización de stock
6. Sincronización con DERMOFARM

### 3.2 Proceso de Sincronización

1. Verificación de cambios en DERMOFARM
2. Actualización de datos locales
3. Resolución de conflictos
4. Registro de última sincronización

### 3.3 Gestión de Stock

1. Monitoreo de niveles de stock
2. Actualización automática
3. Validación de disponibilidad
4. Registro de cambios

## 4. Roles y Permisos

### 4.1 Administrador (admin)

- Acceso completo al sistema
- Gestión de usuarios
- Configuración del sistema
- Sincronización manual
- Eliminación de registros

### 4.2 Operador (operator)

- Gestión de productos
- Gestión de órdenes
- Gestión de clientes
- Consulta de reportes
- No puede eliminar registros

## 5. Interfaz de Usuario

### 5.1 Endpoints de la API

#### Productos

- `POST /products`: Crear producto
- `GET /products`: Listar productos
- `GET /products/:id`: Obtener producto
- `PATCH /products/:id`: Actualizar producto
- `DELETE /products/:id`: Eliminar producto
- `POST /products/sync`: Sincronizar con DERMOFARM

#### Órdenes

- `POST /orders`: Crear orden
- `GET /orders`: Listar órdenes
- `GET /orders/:id`: Obtener orden
- `PATCH /orders/:id`: Actualizar orden
- `DELETE /orders/:id`: Eliminar orden
- `POST /orders/sync`: Sincronizar con DERMOFARM
- `GET /orders/customer/:id`: Órdenes por cliente

#### Clientes

- `POST /customers`: Crear cliente
- `GET /customers`: Listar clientes
- `GET /customers/:id`: Obtener cliente
- `PATCH /customers/:id`: Actualizar cliente
- `DELETE /customers/:id`: Eliminar cliente
- `POST /customers/sync`: Sincronizar con DERMOFARM
- `GET /customers/:id/orders`: Órdenes del cliente

### 5.2 Formato de Datos

#### Producto

```typescript
{
  id: number;
  dermofarmId: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Orden

```typescript
{
  id: number;
  dermofarmId: number;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: string;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Cliente

```typescript
{
  id: number;
  dermofarmId: number;
  name: string;
  email: string;
  phone: string;
  orders: Order[];
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 6. Operaciones

### 6.1 Tareas Diarias

- Verificación de sincronización
- Monitoreo de errores
- Backup de datos

### 6.2 Tareas Semanales

- Limpieza de logs
- Verificación de integridad
- Reportes de sincronización

### 6.3 Tareas Mensuales

- Análisis de rendimiento
- Optimización de base de datos
- Actualización de documentación

## 7. Reportes

### 7.1 Reportes de Sincronización

- Estado de sincronización
- Errores encontrados
- Tiempo de sincronización

### 7.2 Reportes de Operaciones

- Órdenes por período
- Productos más vendidos
- Clientes activos

### 7.3 Reportes de Rendimiento

- Tiempo de respuesta
- Uso de recursos
- Errores del sistema
