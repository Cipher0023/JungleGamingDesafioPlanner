import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    console.log('Creating Nest application...');
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const port = process.env.PORT ?? 3004;
    app.setGlobalPrefix('api');
    console.log(`Attempting to listen on port ${port}...`);
    await app.listen(port);
    console.log(`✅ Notifications Service running on port ${port}`);
  } catch (error) {
    console.error('❌ Failed to start Notifications Service:', error);
    process.exit(1);
  }
}
bootstrap();
