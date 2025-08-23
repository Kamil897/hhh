import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // placeholder
  }

  handleDisconnect(client: Socket) {
    // placeholder
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, payload: any) {
    client.emit('pong', payload ?? 'pong');
  }
}