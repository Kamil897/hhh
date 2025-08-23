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
exports.GamesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const games_service_1 = require("./games.service");
const QUESTIONS = [
    { id: 'q1', question: '2 + 2 = ?', answers: ['3', '4', '5'], correct: 1, reward: 2 },
    { id: 'q2', question: 'Столица Франции?', answers: ['Берлин', 'Париж', 'Рим'], correct: 1, reward: 2 },
];
let GamesController = class GamesController {
    gamesService;
    constructor(gamesService) {
        this.gamesService = gamesService;
    }
    getQuiz() {
        const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
        return { id: q.id, question: q.question, answers: q.answers };
    }
    async answer(req, body) {
        const q = QUESTIONS.find((x) => x.id === body.id);
        if (!q)
            return { correct: false };
        const correct = q.correct === body.answer;
        if (correct) {
            await this.gamesService.awardPoints(req.user.sub, q.reward, 'game_quiz', `Quiz ${q.id}`);
        }
        return { correct, reward: correct ? q.reward : 0 };
    }
};
exports.GamesController = GamesController;
__decorate([
    (0, common_1.Get)('quiz'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GamesController.prototype, "getQuiz", null);
__decorate([
    (0, common_1.Post)('quiz/answer'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "answer", null);
exports.GamesController = GamesController = __decorate([
    (0, common_1.Controller)('games'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [games_service_1.GamesService])
], GamesController);
//# sourceMappingURL=games.controller.js.map