import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('🔐 Auth Service API')
    .setDescription(
      'Microserviço de autenticação e gerenciamento de usuários.\n\n' +
        '**Funcionalidades:**\n' +
        '- Registro de novos usuários\n' +
        '- Login com JWT (access + refresh tokens)\n' +
        '- Renovação de tokens\n' +
        '- Perfil do usuário autenticado (rota protegida)',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o accessToken obtido no /auth/login',
      },
      'bearer',
    )
    .addTag('Autenticação', 'Endpoints de registro, login e tokens')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Auth Service API',
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`🔐 Auth Service rodando em http://localhost:${port}/api`);
  console.log(`📚 Swagger: http://localhost:${port}/docs`);
}
bootstrap();
