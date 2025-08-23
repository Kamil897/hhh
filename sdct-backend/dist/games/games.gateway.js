"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const games_service_1 = require("./games.service");
let GamesGateway = class GamesGateway {
    jwtService;
    gamesService;
    server;
    waiting = [];
    socketToUser = new Map();
    rooms = new Map();
    constructor(jwtService, gamesService) {
        this.jwtService = jwtService;
        this.gamesService = gamesService;
    }
    handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers['authorization']?.toString()?.replace('Bearer ', '');
            if (!token)
                return client.disconnect(true);
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'dev_secret' });
            this.socketToUser.set(client.id, payload.sub);
            client.emit('rps:status', { status: 'connected' });
        }
        catch {
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        this.socketToUser.delete(client.id);
        this.waiting = this.waiting.filter((w) => w.socket.id !== client.id);
        for (const [roomId, state] of this.rooms.entries()) {
            if (state.players.includes(client.id)) {
                this.rooms.delete(roomId);
                this.server.to(roomId).emit('rps:status', { status: 'opponent_left' });
            }
        }
    }
    onJoin(client) {
        const userId = this.socketToUser.get(client.id);
        if (!userId)
            return client.disconnect(true);
        const waiting = this.waiting.shift();
        if (waiting && waiting.socket.id !== client.id) {
            const roomId = `rps:${waiting.socket.id.slice(0, 5)}-${client.id.slice(0, 5)}`;
            waiting.socket.join(roomId);
            client.join(roomId);
            const state = { roomId, players: [waiting.socket.id, client.id], moves: {} };
            this.rooms.set(roomId, state);
            this.server.to(roomId).emit('rps:paired', { roomId });
        }
        else {
            this.waiting.push({ socket: client, userId });
            client.emit('rps:status', { status: 'waiting' });
        }
    }
    async onMove(client, payload) {
        const userId = this.socketToUser.get(client.id);
        if (!userId)
            return client.disconnect(true);
        const state = this.rooms.get(payload.roomId);
        if (!state || !state.players.includes(client.id))
            return;
        state.moves[client.id] = payload.move;
        const [a, b] = state.players;
        const moveA = state.moves[a];
        const moveB = state.moves[b];
        if (!moveA || !moveB)
            return;
        const winner = this.resolve(moveA, moveB);
        let result = { a: moveA, b: moveB, winner: null };
        if (winner === 0) {
            result.winner = 'draw';
        }
        else if (winner === 1) {
            result.winner = a;
            if (client.id === a)
                await this.gamesService.awardPoints(userId, 5, 'game_win', 'RPS win');
            else
                await this.gamesService.awardPoints(this.socketToUser.get(a), 5, 'game_win', 'RPS win');
        }
        else {
            result.winner = b;
            if (client.id === b)
                await this.gamesService.awardPoints(userId, 5, 'game_win', 'RPS win');
            else
                await this.gamesService.awardPoints(this.socketToUser.get(b), 5, 'game_win', 'RPS win');
        }
        this.server.to(state.roomId).emit('rps:roundResult', result);
        state.moves = {};
    }
    resolve(a, b) {
        if (a === b)
            return 0;
        if ((a === 'rock' && b === 'scissors') || (a === 'paper' && b === 'rock') || (a === 'scissors' && b === 'paper'))
            return 1;
        return 2;
    }
};
exports.GamesGateway = GamesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GamesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('rps:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "onJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('rps:move'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GamesGateway.prototype, "onMove", null);
exports.GamesGateway = GamesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [jwt_1.JwtService, games_service_1.GamesService])
], GamesGateway);
//# sourceMappingURL=games.gateway.js.map