import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../database/entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(userId: string, type: string, message: string, taskId?: string) {
    const notification = this.notificationRepository.create({
      userId,
      type,
      message,
      taskId,
    });
    return this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: string, unreadOnly = false) {
    const query = this.notificationRepository
      .createQueryBuilder('n')
      .where('n.userId = :userId', { userId });

    if (unreadOnly) {
      query.andWhere('n.read = :read', { read: false });
    }

    return query.orderBy('n.createdAt', 'DESC').take(50).getMany();
  }

  async markAsRead(notificationId: string) {
    return this.notificationRepository.update(notificationId, { read: true });
  }

  async markAllAsRead(userId: string) {
    return this.notificationRepository.update(
      { userId, read: false },
      { read: true },
    );
  }
}
