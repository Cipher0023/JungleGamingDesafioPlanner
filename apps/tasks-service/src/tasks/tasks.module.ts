import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '../database/entities/task.entity';
import { Comment } from '../database/entities/comment.entity';
import { TaskAssignment } from '../database/entities/task-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Comment, TaskAssignment]),
    // Temporarily disabled RabbitMQ to test
    /*
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672',
          ],
          queue: 'tasks_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
    */
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
