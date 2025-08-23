import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { GamesService } from './games.service';

interface PlayerInfo { socket: Socket; userId: string; }
interface RoomState { roomId: string; players: string[]; moves: Record<string, 'rock'|'paper'|'scissors'|undefined>; }

@WebSocketGateway({ cors: { origin: '*' } })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private waiting: PlayerInfo[] = [];
  private socketToUser = new Map<string, string>();
  private rooms = new Map<string, RoomState>();

  constructor(private readonly jwtService: JwtService, private readonly gamesService: GamesService) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers['authorization']?.toString()?.replace('Bearer ', '');
      if (!token) return client.disconnect(true);
      const payload: any = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'dev_secret' });
      this.socketToUser.set(client.id, payload.sub);
      client.emit('rps:status', { status: 'connected' });
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.socketToUser.delete(client.id);
    this.waiting = this.waiting.filter((w) => w.socket.id !== client.id);
    // cleanup rooms
    for (const [roomId, state] of this.rooms.entries()) {
      if (state.players.includes(client.id)) {
        this.rooms.delete(roomId);
        this.server.to(roomId).emit('rps:status', { status: 'opponent_left' });
      }
    }
  }

  @SubscribeMessage('rps:join')
  onJoin(@ConnectedSocket() client: Socket) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) return client.disconnect(true);
    // try to pair
    const waiting = this.waiting.shift();
    if (waiting && waiting.socket.id !== client.id) {
      const roomId = `rps:${waiting.socket.id.slice(0, 5)}-${client.id.slice(0, 5)}`;
      waiting.socket.join(roomId);
      client.join(roomId);
      const state: RoomState = { roomId, players: [waiting.socket.id, client.id], moves: {} };
      this.rooms.set(roomId, state);
      this.server.to(roomId).emit('rps:paired', { roomId });
    } else {
      this.waiting.push({ socket: client, userId });
      client.emit('rps:status', { status: 'waiting' });
    }
  }

  @SubscribeMessage('rps:move')
  async onMove(@ConnectedSocket() client: Socket, @MessageBody() payload: { roomId: string; move: 'rock'|'paper'|'scissors' }) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) return client.disconnect(true);
    const state = this.rooms.get(payload.roomId);
    if (!state || !state.players.includes(client.id)) return;
    state.moves[client.id] = payload.move;
    const [a, b] = state.players;
    const moveA = state.moves[a];
    const moveB = state.moves[b];
    if (!moveA || !moveB) return;

    const winner = this.resolve(moveA, moveB);
    let result: any = { a: moveA, b: moveB, winner: null };
    if (winner === 0) {
      result.winner = 'draw';
    } else if (winner === 1) {
      result.winner = a;
      if (client.id === a) await this.gamesService.awardPoints(userId, 5, 'game_win', 'RPS win');
      else await this.gamesService.awardPoints(this.socketToUser.get(a)!, 5, 'game_win', 'RPS win');
    } else {
      result.winner = b;
      if (client.id === b) await this.gamesService.awardPoints(userId, 5, 'game_win', 'RPS win');
      else await this.gamesService.awardPoints(this.socketToUser.get(b)!, 5, 'game_win', 'RPS win');
    }
    this.server.to(state.roomId).emit('rps:roundResult', result);
    state.moves = {} as any; // reset for next round
  }

  private resolve(a: 'rock'|'paper'|'scissors', b: 'rock'|'paper'|'scissors') {
    if (a === b) return 0;
    if ((a === 'rock' && b === 'scissors') || (a === 'paper' && b === 'rock') || (a === 'scissors' && b === 'paper')) return 1;
    return 2;
  }
}