"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const realtime_module_1 = require("./realtime/realtime.module");
const payments_module_1 = require("./payments/payments.module");
const profile_module_1 = require("./profile/profile.module");
const store_module_1 = require("./store/store.module");
const games_module_1 = require("./games/games.module");
const cognia_module_1 = require("./cognia/cognia.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST', '127.0.0.1'),
                    port: parseInt(configService.get('DB_PORT', '3306'), 10),
                    username: configService.get('DB_USER', 'root'),
                    password: configService.get('DB_PASSWORD', 'password'),
                    database: configService.get('DB_NAME', 'sdct'),
                    autoLoadEntities: true,
                    synchronize: configService.get('DB_SYNC', 'true') === 'true',
                }),
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            realtime_module_1.RealtimeModule,
            payments_module_1.PaymentsModule,
            profile_module_1.ProfileModule,
            store_module_1.StoreModule,
            games_module_1.GamesModule,
            cognia_module_1.CogniaModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map