import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as amqp from 'amqplib';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from '../notifications.gateway';

@Injectable()
export class NotificationsConsumer implements OnModuleInit {
  private channel: amqp.Channel;

  constructor(
    private notificationsService: NotificationsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async onModuleInit() {
    await this.setupRabbitMQ();
  }

  private async setupRabbitMQ() {
    try {
      const connection = await amqp.connect(
        process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672',
      );
      this.channel = await connection.createChannel();

      const queue = 'tasks_events';
      await this.channel.assertQueue(queue, { durable: true });

      this.channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const event = JSON.parse(msg.content.toString());
            await this.handleEvent(event);
            this.channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            this.channel.nack(msg, false, true);
          }
        }
      });

      console.log('RabbitMQ consumer listening on queue: tasks_events');
    } catch (error) {
      console.error('RabbitMQ connection error:', error);
    }
  }

  private async handleEvent(event: any) {
    const { task, status, priority, assignedTo, comment, authorId } = event;

    if (event.type === 'task.created') {
      const notification = await this.notificationsService.create(
        event.createdBy,
        'task:created',
        `Você criou a tarefa: ${event.title}`,
        event.taskId,
      );
      this.notificationsGateway.notifyUser(
        event.createdBy,
        'task:created',
        notification,
      );
    }

    if (event.type === 'task.updated') {
      const notification = await this.notificationsService.create(
        event.createdBy,
        'task:updated',
        `Tarefa atualizada: ${event.title}`,
        event.taskId,
      );
      this.notificationsGateway.notifyUser(
        event.createdBy,
        'task:updated',
        notification,
      );
    }

    if (event.type === 'task.assigned') {
      const notification = await this.notificationsService.create(
        event.userId,
        'task:assigned',
        `Você foi atribuído a uma tarefa`,
        event.taskId,
      );
      this.notificationsGateway.notifyUser(
        event.userId,
        'task:assigned',
        notification,
      );
    }

    if (event.type === 'comment.created') {
      const notification = await this.notificationsService.create(
        event.createdBy,
        'comment:new',
        `Novo comentário em uma tarefa`,
        event.taskId,
      );
      this.notificationsGateway.notifyUser(
        event.createdBy,
        'comment:new',
        notification,
      );
    }
  }
}
