# Buenas Prácticas - NestJS

## 1. Estructura del Proyecto

### 1.1 Organización de Módulos

- Cada módulo debe tener su propio directorio
- Mantener una estructura clara y consistente
- Separar la lógica de negocio de la infraestructura

```
src/
├── modules/
│   ├── products/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.module.ts
│   ├── orders/
│   └── customers/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
└── config/
```

### 1.2 Nombrado de Archivos

- Usar nombres descriptivos y en singular
- Seguir el patrón: `nombre.funcionalidad.ts`
- Ejemplos:
  - `product.entity.ts`
  - `order.service.ts`
  - `customer.controller.ts`

## 2. Controladores

### 2.1 Estructura

```typescript
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles("admin", "operator")
  async findAll() {
    return this.productsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles("admin")
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}
```

### 2.2 Buenas Prácticas

- Mantener los controladores delgados
- Usar DTOs para validación de datos
- Implementar manejo de errores consistente
- Documentar endpoints con Swagger
- Usar decoradores de roles y permisos

## 3. Servicios

### 3.1 Estructura

```typescript
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dermofarmService: DermofarmService
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }
}
```

### 3.2 Buenas Prácticas

- Implementar la lógica de negocio en servicios
- Usar inyección de dependencias
- Manejar transacciones cuando sea necesario
- Implementar manejo de errores
- Mantener los servicios testables

## 4. DTOs y Validación

### 4.1 Estructura

```typescript
export class CreateProductDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsNumber()
  @Min(0)
  @ApiProperty()
  price: number;

  @IsInt()
  @Min(0)
  @ApiProperty()
  stock: number;
}
```

### 4.2 Buenas Prácticas

- Usar class-validator para validación
- Documentar con Swagger
- Separar DTOs de creación y actualización
- Usar tipos estrictos
- Implementar transformaciones de datos

## 5. Entidades

### 5.1 Estructura

```typescript
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 5.2 Buenas Prácticas

- Usar decoradores de TypeORM
- Implementar timestamps
- Definir relaciones claramente
- Usar tipos de datos apropiados
- Mantener las entidades simples

## 6. Manejo de Errores

### 6.1 Filtros de Excepción

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
```

### 6.2 Buenas Prácticas

- Implementar filtros de excepción globales
- Usar excepciones HTTP apropiadas
- Mantener mensajes de error descriptivos
- Logging de errores
- Manejo de errores de base de datos

## 7. Seguridad

### 7.1 Guards

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
```

### 7.2 Buenas Prácticas

- Implementar autenticación JWT
- Usar guards para protección de rutas
- Implementar roles y permisos
- Validar datos de entrada
- Sanitizar datos de salida

## 8. Testing

### 8.1 Estructura

```typescript
describe("ProductsService", () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
```

### 8.2 Buenas Prácticas

- Escribir tests unitarios
- Implementar tests de integración
- Usar mocks y stubs
- Mantener tests independientes
- Seguir el patrón AAA (Arrange, Act, Assert)

## 9. Configuración

### 9.1 Variables de Entorno

```typescript
@Injectable()
export class ConfigService {
  constructor(private configService: ConfigService) {}

  get databaseConfig() {
    return {
      host: this.configService.get("DB_HOST"),
      port: this.configService.get("DB_PORT"),
      username: this.configService.get("DB_USER"),
      password: this.configService.get("DB_PASSWORD"),
    };
  }
}
```

### 9.2 Buenas Prácticas

- Usar ConfigService para variables de entorno
- Implementar validación de configuración
- Mantener configuración por entorno
- Usar valores por defecto
- Documentar variables requeridas

## 10. Logging

### 10.1 Implementación

```typescript
@Injectable()
export class LoggerService implements LoggerService {
  log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  error(message: string, trace: string) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, trace);
  }
}
```

### 10.2 Buenas Prácticas

- Implementar logging estructurado
- Usar niveles de log apropiados
- Incluir contexto en logs
- Implementar rotación de logs
- Mantener logs seguros
