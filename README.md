# Servicio de Integración DERMOFARM

## Descripción
Servicio de middleware para la sincronización y gestión de datos entre DERMOFARM y el sistema del agente. Proporciona una API RESTful para la gestión de productos, clientes y órdenes, con sincronización automática programada.

## Características Principales
- 🔄 Sincronización automática con DERMOFARM
- 🔒 Sistema de autenticación y autorización
- 📦 Gestión completa de productos
- 👥 Gestión de clientes
- 📋 Gestión de órdenes
- 📊 Documentación API con Swagger

## Requisitos
- Node.js v18+
- SQL Server (producción)
- SQLite (desarrollo)

## Inicio Rápido

1. **Clonar el repositorio:**
   ```bash
   git clone <repositorio>
   cd dermofarm-service
   ```

2. **Ejecutar script de inicialización:**
   ```bash
   ./init-script.sh
   ```

3. **Configurar variables de entorno:**
   - Copiar .env.example a .env
   - Ajustar las variables según el entorno

4. **Iniciar el servidor:**
   ```bash
   # Desarrollo
   npm run start:dev

   # Producción
   npm run start:prod
   ```

## Documentación
- 📚 [Guía Rápida](documentation/QUICKSTART.md)
- 🔧 [Documentación Técnica](documentation/TECHNICAL_DOCUMENTATION.md)
- ✨ [Buenas Prácticas](documentation/BEST_PRACTICES.md)

## Estructura del Proyecto
```
src/
├── config/           # Configuraciones
├── modules/         # Módulos principales
├── services/        # Servicios compartidos
└── utils/          # Utilidades
```

## Módulos Principales
- 🔐 **Auth**: Autenticación y autorización
- 📦 **Products**: Gestión de productos
- 👥 **Customers**: Gestión de clientes
- 📋 **Orders**: Gestión de órdenes
- 🔄 **Sync**: Sincronización con DERMOFARM

## API Documentation
La documentación de la API está disponible en:
```
http://localhost:3000/api
```

## Scripts Disponibles
- `npm run start:dev` - Iniciar en modo desarrollo
- `npm run build` - Compilar el proyecto
- `npm run start:prod` - Iniciar en modo producción
- `npm run test` - Ejecutar tests
- `npm run lint` - Verificar estilo de código

## Contribución
1. Crear rama desde `main`
2. Realizar cambios
3. Ejecutar tests
4. Crear Pull Request

## Soporte
Para soporte técnico:
- Email: soporte@dermofarm.com
- Documentación: Ver carpeta `/documentation`

## Licencia
Este proyecto es privado y confidencial.
Copyright © 2025 DERMOFARM
