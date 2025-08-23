"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SdctCryptoService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let SdctCryptoService = class SdctCryptoService {
    key;
    constructor() {
        const raw = process.env.SDCT_ENC_KEY || '';
        this.key = this.deriveKey(raw);
    }
    encrypt(plain) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
        const ciphertext = Buffer.concat([cipher.update(Buffer.from(plain, 'utf8')), cipher.final()]);
        const tag = cipher.getAuthTag();
        const payload = `SDCTv1:${iv.toString('base64')}:${ciphertext.toString('base64')}:${tag.toString('base64')}`;
        return payload;
    }
    decrypt(payload) {
        if (!payload || !payload.startsWith('SDCTv1:')) {
            return payload;
        }
        const parts = payload.split(':');
        if (parts.length !== 4)
            return payload;
        const iv = Buffer.from(parts[1], 'base64');
        const data = Buffer.from(parts[2], 'base64');
        const tag = Buffer.from(parts[3], 'base64');
        const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
        decipher.setAuthTag(tag);
        const plain = Buffer.concat([decipher.update(data), decipher.final()]);
        return plain.toString('utf8');
    }
    deriveKey(secret) {
        if (!secret) {
            return crypto.createHash('sha256').update('sdct_dev_key').digest();
        }
        try {
            if (/^[0-9a-fA-F]{64}$/.test(secret)) {
                return Buffer.from(secret, 'hex');
            }
            const b64 = Buffer.from(secret, 'base64');
            if (b64.length === 32)
                return b64;
        }
        catch { }
        return crypto.createHash('sha256').update(secret, 'utf8').digest();
    }
};
exports.SdctCryptoService = SdctCryptoService;
exports.SdctCryptoService = SdctCryptoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SdctCryptoService);
//# sourceMappingURL=sdct-crypto.service.js.map