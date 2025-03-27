# DERMOFARM Service

Servicio de sincronización y gestión de datos para DERMOFARM, desarrollado con NestJS.

## 🚀 Descripción

Este servicio actúa como un agente de sincronización y gestión de datos entre un sistema local y la API de DERMOFARM. Proporciona una interfaz REST para gestionar productos, órdenes y clientes, manteniendo la sincronización con el sistema principal de DERMOFARM.

## ✨ Características

- 🔄 Sincronización bidireccional con DERMOFARM
- 📦 Gestión de productos y stock
- 🛍️ Gestión de órdenes
- 👥 Gestión de clientes
- 🔒 Autenticación JWT con roles
- 📊 Reportes y monitoreo
- 🐳 Contenedorización con Docker

## 📚 Documentación

- [Guía de Inicio Rápido](documentation/QUICKSTART.md) - Configuración y puesta en marcha
- [Documentación Técnica](documentation/TECHNICAL.md) - Detalles técnicos y arquitectura
- [Documentación Funcional](documentation/FUNCTIONAL.md) - Funcionalidades y flujos de negocio
- [Documentación de la API](documentation/API.md) - Endpoints y uso de la API
- [Buenas Prácticas](documentation/BEST_PRACTICES.md) - Guías y estándares de desarrollo

## 🛠️ Tecnologías

- **Framework**: NestJS
- **Base de Datos**: SQL Server
- **ORM**: TypeORM
- **Documentación**: Swagger/OpenAPI
- **Validación**: class-validator
- **Transformación**: class-transformer
- **HTTP Client**: Axios
- **Contenedorización**: Docker

## 🚀 Inicio Rápido

1. Clonar el repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
cd dermofarm-srv
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. Iniciar los servicios:

```bash
docker-compose up -d
```

4. Acceder a la documentación de la API:

- Swagger UI: http://localhost:3000/api

## 📁 Estructura del Proyecto

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

## 🔒 Seguridad

- Autenticación mediante JWT
- Sistema de roles (admin, operator)
- Validación de datos
- Protección de endpoints

## 📊 Monitoreo

- Logs de aplicación
- Healthchecks
- Métricas de sincronización
- Reportes de operaciones

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Dermofarm** - _Development_ - [TuUsuario](https://github.com/dermofarm)

## 🙏 Agradecimientos

- NestJS Team
- DERMOFARM Team
- Todos los contribuidores
