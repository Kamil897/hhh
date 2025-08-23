"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const item_entity_1 = require("./item.entity");
const store_service_1 = require("./store.service");
const store_controller_1 = require("./store.controller");
const users_module_1 = require("../users/users.module");
const purchase_entity_1 = require("../profile/purchase.entity");
const transaction_entity_1 = require("../profile/transaction.entity");
let StoreModule = class StoreModule {
};
exports.StoreModule = StoreModule;
exports.StoreModule = StoreModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([item_entity_1.StoreItem, purchase_entity_1.Purchase, transaction_entity_1.Transaction]), users_module_1.UsersModule],
        providers: [store_service_1.StoreService],
        controllers: [store_controller_1.StoreController],
    })
], StoreModule);
//# sourceMappingURL=store.module.js.map