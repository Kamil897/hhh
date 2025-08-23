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
exports.CogniaController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const cognia_service_1 = require("./cognia.service");
const class_validator_1 = require("class-validator");
class CreateConvDto {
    model;
    teacher;
    title;
}
__decorate([
    (0, class_validator_1.IsIn)(['phi3', 'gpt', 'llama']),
    __metadata("design:type", String)
], CreateConvDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['math', 'history', 'languages']),
    __metadata("design:type", String)
], CreateConvDto.prototype, "teacher", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConvDto.prototype, "title", void 0);
class SendMessageDto {
    content;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
let CogniaController = class CogniaController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(req) {
        return this.service.listConversations(req.user.sub);
    }
    create(req, dto) {
        return this.service.createConversation(req.user.sub, dto.model, dto.teacher, dto.title);
    }
    get(req, id) {
        return this.service.getConversation(req.user.sub, id);
    }
    send(req, id, dto) {
        return this.service.sendMessage(req.user.sub, id, dto.content);
    }
};
exports.CogniaController = CogniaController;
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CogniaController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('conversations'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateConvDto]),
    __metadata("design:returntype", void 0)
], CogniaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CogniaController.prototype, "get", null);
__decorate([
    (0, common_1.Post)('conversations/:id/messages'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, SendMessageDto]),
    __metadata("design:returntype", void 0)
], CogniaController.prototype, "send", null);
exports.CogniaController = CogniaController = __decorate([
    (0, common_1.Controller)('cognia'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cognia_service_1.CogniaService])
], CogniaController);
//# sourceMappingURL=cognia.controller.js.map