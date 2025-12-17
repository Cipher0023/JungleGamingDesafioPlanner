import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ClientsModule } from './infra/clients/clients.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AuthModule, TasksModule, ClientsModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
