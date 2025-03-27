# Documentación Técnica - DERMOFARM Service

## 1. Arquitectura del Sistema

### 1.1 Descripción General

El servicio DERMOFARM es una aplicación backend desarrollada con NestJS que actúa como un agente de sincronización y gestión de datos entre un sistema local y la API de DERMOFARM. El sistema está diseñado para manejar productos, órdenes y clientes, proporcionando una capa de abstracción y sincronización bidireccional.

### 1.2 Componentes Principales

- **API REST**: Endpoints para gestionar productos, órdenes y clientes
- **Base de Datos**: SQL Server para almacenamiento persistente
- **Sincronización**: Sistema de sincronización con DERMOFARM
- **Autenticación**: Sistema de autenticación JWT con roles

### 1.3 Tecnologías Utilizadas

- **Framework**: NestJS
- **Base de Datos**: SQL Server
- **ORM**: TypeORM
- **Documentación**: Swagger/OpenAPI
- **Validación**: class-validator
- **Transformación**: class-transformer
- **HTTP Client**: Axios
- **Contenedorización**: Docker

## 2. Estructura del Proyecto

```
src/
├── controllers/         # Controladores de la API
├── services/           # Lógica de negocio
├── entities/           # Entidades de la base de datos
├── dto/               # Objetos de transferencia de datos
├── guards/            # Guards de autenticación y autorización
├── decorators/        # Decoradores personalizados
├── config/            # Configuración de la aplicación
└── main.ts            # Punto de entrada de la aplicación
```

## 3. Modelos de Datos

### 3.1 Product

```typescript
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dermofarmId: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column("float")
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  lastSync: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
```

### 3.2 Order

```typescript
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dermofarmId: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @Column("float")
  total: number;

  @Column({
    default: "pending",
  })
  status: string;

  @Column({ nullable: true })
  lastSync: Date;
}
```

### 3.3 Customer

```typescript
@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dermofarmId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
```

## 4. Servicios

### 4.1 ProductService

- Gestión CRUD de productos
- Sincronización con DERMOFARM
- Validación de datos
- Manejo de errores

### 4.2 OrderService

- Gestión CRUD de órdenes
- Sincronización con DERMOFARM
- Gestión de items de orden
- Validación de datos

### 4.3 CustomerService

- Gestión CRUD de clientes
- Sincronización con DERMOFARM
- Validación de datos
- Manejo de errores

### 4.4 DermofarmService

- Comunicación con API de DERMOFARM
- Manejo de errores de conexión
- Transformación de datos

## 5. Seguridad

### 5.1 Autenticación

- Implementación de JWT
- Guard de autenticación
- Manejo de tokens

### 5.2 Autorización

- Sistema de roles (admin, operator)
- Guard de roles
- Decoradores de roles

## 6. Configuración

### 6.1 Variables de Entorno

```env
PORT=3000
DB_HOST=sqlserver
DB_PORT=1433
DB_NAME=dermofarm
DB_USER=sa
DB_PASSWORD=YourStrong@Passw0rd
DERMOFARM_API_URL=http://localhost:8080/api
```

### 6.2 Docker

- Configuración de contenedores
- Volúmenes persistentes
- Redes Docker
- Healthchecks

## 7. Despliegue

### 7.1 Requisitos

- Docker y Docker Compose
- Node.js 18+
- SQL Server 2022

### 7.2 Pasos de Despliegue

1. Clonar el repositorio
2. Configurar variables de entorno
3. Construir y ejecutar contenedores
4. Verificar logs y estado

### 7.3 Monitoreo

- Logs de aplicación
- Healthchecks
- Métricas de sincronización

## 8. Mantenimiento

### 8.1 Tareas Periódicas

- Sincronización con DERMOFARM
- Limpieza de logs
- Backup de base de datos

### 8.2 Troubleshooting

- Verificación de conexiones
- Análisis de logs
- Resolución de conflictos de datos
