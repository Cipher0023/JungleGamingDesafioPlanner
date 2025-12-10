import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('test-message')
  handleTestMessage(client: Socket, data: any) {
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
