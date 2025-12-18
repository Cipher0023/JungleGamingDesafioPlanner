import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { dataSourceOptions } from './database/config/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
