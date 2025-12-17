import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { TasksService } from './tasks/tasks.service';

@Module({
  providers: [AuthService, TasksService]
})
export class ClientsModule {}
