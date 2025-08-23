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
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const item_entity_1 = require("./item.entity");
const users_service_1 = require("../users/users.service");
const purchase_entity_1 = require("../profile/purchase.entity");
const transaction_entity_1 = require("../profile/transaction.entity");
let StoreService = class StoreService {
    storeRepo;
    purchaseRepo;
    txRepo;
    usersService;
    constructor(storeRepo, purchaseRepo, txRepo, usersService) {
        this.storeRepo = storeRepo;
        this.purchaseRepo = purchaseRepo;
        this.txRepo = txRepo;
        this.usersService = usersService;
    }
    listActive() {
        return this.storeRepo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
    }
    async purchase(userId, itemId) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const item = await this.storeRepo.findOne({ where: { id: itemId, isActive: true } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        const existing = await this.purchaseRepo.findOne({ where: { user: { id: userId }, itemId: item.id } });
        if (existing)
            return existing;
        if (user.points < item.price)
            throw new common_1.BadRequestException('Not enough points');
        await this.usersService['usersRepository'].decrement({ id: userId }, 'points', item.price);
        const tx = this.txRepo.create({ user: { id: userId }, amount: -item.price, type: 'purchase', description: item.name });
        await this.txRepo.save(tx);
        const purchase = this.purchaseRepo.create({ user: { id: userId }, itemId: item.id, itemName: item.name, price: item.price, assetUrl: item.assetUrl ?? null });
        await this.purchaseRepo.save(purchase);
        await this.applyItemEffect(userId, item);
        return purchase;
    }
    async useItem(userId, itemId) {
        const item = await this.storeRepo.findOne({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        const owned = await this.purchaseRepo.findOne({ where: { user: { id: userId }, itemId: item.id } });
        if (!owned)
            throw new common_1.BadRequestException('Item not owned');
        await this.applyItemEffect(userId, item);
        return { ok: true };
    }
    async applyItemEffect(userId, item) {
        switch (item.type) {
            case 'prefix':
                await this.usersService['usersRepository'].update({ id: userId }, { prefix: item.value ?? null });
                break;
            case 'background':
                await this.usersService['usersRepository'].update({ id: userId }, { theme: item.value ?? 'light' });
                break;
            case 'avatar':
                await this.usersService['usersRepository'].update({ id: userId }, { avatarUrl: item.assetUrl ?? null });
                break;
            default:
                break;
        }
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(item_entity_1.StoreItem)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_entity_1.Purchase)),
    __param(2, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService])
], StoreService);
//# sourceMappingURL=store.service.js.map