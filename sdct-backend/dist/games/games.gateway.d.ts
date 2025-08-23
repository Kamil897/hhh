import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { GamesService } from './games.service';
export declare class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly gamesService;
    server: Server;
    private waiting;
    private socketToUser;
    private rooms;
    constructor(jwtService: JwtService, gamesService: GamesService);
    handleConnection(client: Socket): Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | undefined;
    handleDisconnect(client: Socket): void;
    onJoin(client: Socket): Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | undefined;
    onMove(client: Socket, payload: {
        roomId: string;
        move: 'rock' | 'paper' | 'scissors';
    }): Promise<Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | undefined>;
    private resolve;
}
