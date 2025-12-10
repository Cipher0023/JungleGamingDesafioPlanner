import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Notifications Service rodando na porta ${port}`);
}
bootstrap();
