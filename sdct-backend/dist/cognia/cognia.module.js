"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CogniaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const conversation_entity_1 = require("./conversation.entity");
const message_entity_1 = require("./message.entity");
const cognia_service_1 = require("./cognia.service");
const cognia_controller_1 = require("./cognia.controller");
const cognia_provider_1 = require("./cognia.provider");
let CogniaModule = class CogniaModule {
};
exports.CogniaModule = CogniaModule;
exports.CogniaModule = CogniaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([conversation_entity_1.Conversation, message_entity_1.Message])],
        providers: [cognia_service_1.CogniaService, cognia_provider_1.CogniaProvider],
        controllers: [cognia_controller_1.CogniaController],
    })
], CogniaModule);
//# sourceMappingURL=cognia.module.js.map