import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .setTitle('📋 Tasks Service API')
    .setDescription(
      'Microserviço de gerenciamento de tarefas, comentários e atribuições.\n\n' +
        '**Funcionalidades:**\n' +
        '- CRUD completo de tarefas\n' +
        '- Comentários em tarefas\n' +
        '- Atribuir tarefas a usuários\n' +
        '- Filtros por status, prioridade e busca\n' +
        '- Integração com RabbitMQ para notificações',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT do auth-service',
      },
      'bearer',
    )
    .addTag('Tarefas', 'CRUD de tarefas')
    .addTag('Comentários', 'Adicionar comentários nas tarefas')
    .addTag('Atribuições', 'Atribuir tarefas a usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Tasks Service API',
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(`📋 Tasks Service rodando em http://localhost:${port}/api`);
  console.log(`📚 Swagger: http://localhost:${port}/docs`);
}
bootstrap();
