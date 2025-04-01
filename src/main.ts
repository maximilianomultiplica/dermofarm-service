import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplicar middleware de seguridad
  app.use(helmet());
  app.enableCors();

  // Configuración de validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('DERMOFARM API')
    .setDescription('API de sincronización y gestión de datos entre DERMOFARM y el sistema del agente')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Iniciar el servidor
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Servidor iniciado en: http://localhost:${port}`);
  console.log(`📝 Documentación de la API: http://localhost:${port}/api`);
}

bootstrap();
