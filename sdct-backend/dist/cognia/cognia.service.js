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
exports.CogniaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("./conversation.entity");
const message_entity_1 = require("./message.entity");
const cognia_provider_1 = require("./cognia.provider");
const sdct_crypto_service_1 = require("../sdct/sdct-crypto.service");
let CogniaService = class CogniaService {
    convRepo;
    msgRepo;
    provider;
    crypto;
    constructor(convRepo, msgRepo, provider, crypto) {
        this.convRepo = convRepo;
        this.msgRepo = msgRepo;
        this.provider = provider;
        this.crypto = crypto;
    }
    async listConversations(userId) {
        return this.convRepo.find({ where: { user: { id: userId } }, order: { updatedAt: 'DESC' } });
    }
    async getConversation(userId, id) {
        const conv = await this.convRepo.findOne({ where: { id, user: { id: userId } }, relations: ['messages'] });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        conv.messages = conv.messages.map((m) => ({ ...m, content: this.crypto.decrypt(m.content) }));
        return conv;
    }
    async createConversation(userId, model, teacher, title) {
        const conv = this.convRepo.create({ user: { id: userId }, model, teacher, title: title ?? null });
        return this.convRepo.save(conv);
    }
    async sendMessage(userId, convId, content) {
        const conv = await this.getConversation(userId, convId);
        const encUser = this.crypto.encrypt(content);
        const userMsg = this.msgRepo.create({ conversation: { id: conv.id }, role: 'user', content: encUser });
        await this.msgRepo.save(userMsg);
        const history = await this.msgRepo.find({ where: { conversation: { id: conv.id } }, order: { createdAt: 'ASC' } });
        const assistantText = await this.provider.generate({ model: conv.model, teacher: conv.teacher, messages: history.map(m => ({ role: m.role, content: this.crypto.decrypt(m.content) })) });
        const encAssistant = this.crypto.encrypt(assistantText);
        const assistantMsg = this.msgRepo.create({ conversation: { id: conv.id }, role: 'assistant', content: encAssistant });
        await this.msgRepo.save(assistantMsg);
        await this.convRepo.update({ id: conv.id }, { updatedAt: new Date() });
        return { assistant: { ...assistantMsg, content: assistantText } };
    }
};
exports.CogniaService = CogniaService;
exports.CogniaService = CogniaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cognia_provider_1.CogniaProvider,
        sdct_crypto_service_1.SdctCryptoService])
], CogniaService);
//# sourceMappingURL=cognia.service.js.map