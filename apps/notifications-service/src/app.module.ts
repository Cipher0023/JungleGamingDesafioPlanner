import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsGateway } from './notifications.gateway';
import { dataSourceOptions } from './database/config/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
