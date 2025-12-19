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

  //validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ⚠️ IMPORTANTE: Swagger ANTES do setGlobalPrefix para evitar conflito
  const config = new DocumentBuilder()
    .setTitle('🚀 Task Manager API Gateway')
    .setDescription(
      'Gateway centralizado para microserviços de gerenciamento de tarefas.\n\n' +
        '**Microserviços disponíveis:**\n' +
        '- 🔐 Auth Service (3002): Autenticação e usuários\n' +
        '- 📋 Tasks Service (3003): CRUD de tarefas, comentários e atribuições\n' +
        '- 🔔 Notifications Service (3004): WebSocket para notificações real-time\n\n' +
        '**Para acessar documentação completa de cada serviço:**\n' +
        '- Auth: http://localhost:3002/api/docs\n' +
        '- Tasks: http://localhost:3003/api/docs',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Insira o JWT token obtido no login',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Gateway', 'Endpoints do próprio API Gateway')
    .addTag('Proxy', 'Rotas que fazem proxy para microserviços')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Task Manager API',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  //prefixo global (aplicado DEPOIS do Swagger)
  app.setGlobalPrefix('api');

  console.log('📚 Swagger disponível em: http://localhost:3001/docs');
  console.log('🔗 API Gateway rodando em: http://localhost:3001/api');

  await app.listen(3001);
}
bootstrap();
