import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications/notifications.service';

@Injectable()
@WebSocketGateway({
  port: 3004,
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>();

  constructor(private notificationsService: NotificationsService) {}

  afterInit() {
    console.log('WebSocket initialized on port 3004');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSockets.set(userId, client.id);
      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  notifyUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }

  @SubscribeMessage('mark_read')
  async markAsRead(client: Socket, data: { notificationId: string }) {
    const userId = client.handshake.query.userId as string;
    await this.notificationsService.markAsRead(data.notificationId);
    client.emit('notification_read', { notificationId: data.notificationId });
  }
}
    console.log(`Mensagem recebida de ${client.id}:`, data);
    client.emit('test-response', {
      message: 'Mensagem recebida com sucesso!',
      receivedData: data,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('broadcast-message')
  handleBroadcastMessage(client: Socket, data: any) {
    console.log(`Broadcast de ${client.id}:`, data);
    this.server.emit('broadcast-response', {
      message: 'Mensagem em broadcast',
      senderClientId: client.id,
      data: data,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    console.log(`Ping recebido de ${client.id}`);
    client.emit('pong', {
      message: 'Pong!',
      timestamp: new Date(),
    });
  }
}
