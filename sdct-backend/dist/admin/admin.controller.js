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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const item_entity_1 = require("../store/item.entity");
const settings_entity_1 = require("../cognia/settings.entity");
let AdminController = class AdminController {
    usersRepo;
    storeRepo;
    settingsRepo;
    constructor(usersRepo, storeRepo, settingsRepo) {
        this.usersRepo = usersRepo;
        this.storeRepo = storeRepo;
        this.settingsRepo = settingsRepo;
    }
    listUsers() {
        return this.usersRepo.find({ order: { createdAt: 'DESC' } });
    }
    async ban(id) { await this.usersRepo.update({ id }, { isBanned: true }); return { ok: true }; }
    async mute(id) { await this.usersRepo.update({ id }, { isMuted: true }); return { ok: true }; }
    async unban(id) { await this.usersRepo.update({ id }, { isBanned: false, isMuted: false }); return { ok: true }; }
    async setRole(id, body) {
        await this.usersRepo.update({ id }, { role: body.role });
        return { ok: true };
    }
    storeItems() { return this.storeRepo.find({ order: { createdAt: 'DESC' } }); }
    createItem(body) { const item = this.storeRepo.create(body); return this.storeRepo.save(item); }
    updateItem(id, body) { return this.storeRepo.update({ id }, body); }
    deleteItem(id) { return this.storeRepo.delete({ id }); }
    async getCognia() {
        const s = await this.settingsRepo.findOne({ where: { id: 'singleton' } });
        return s ?? { id: 'singleton', allowPhi3: true, allowGpt: false, allowLlama: false };
    }
    async setCognia(body) {
        let s = await this.settingsRepo.findOne({ where: { id: 'singleton' } });
        if (!s)
            s = this.settingsRepo.create({ id: 'singleton', allowPhi3: true, allowGpt: false, allowLlama: false });
        Object.assign(s, body);
        await this.settingsRepo.save(s);
        return s;
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'super-admin'),
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listUsers", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'super-admin'),
    (0, common_1.Post)('users/:id/ban'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "ban", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'super-admin'),
    (0, common_1.Post)('users/:id/mute'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "mute", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'super-admin'),
    (0, common_1.Post)('users/:id/unban'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "unban", null);
__decorate([
    (0, roles_decorator_1.Roles)('super-admin'),
    (0, common_1.Post)('users/:id/role'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setRole", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'super-admin'),
    (0, common_1.Get)('store/items'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "storeItems", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'super-admin'),
    (0, common_1.Post)('store/items'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createItem", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'super-admin'),
    (0, common_1.Put)('store/items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateItem", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'super-admin'),
    (0, common_1.Delete)('store/items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteItem", null);
__decorate([
    (0, roles_decorator_1.Roles)('super-admin'),
    (0, common_1.Get)('cognia/settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCognia", null);
__decorate([
    (0, roles_decorator_1.Roles)('super-admin'),
    (0, common_1.Put)('cognia/settings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setCognia", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(item_entity_1.StoreItem)),
    __param(2, (0, typeorm_1.InjectRepository)(settings_entity_1.CogniaSettings)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminController);
//# sourceMappingURL=admin.controller.js.map