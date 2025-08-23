"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CogniaProvider = void 0;
const common_1 = require("@nestjs/common");
let CogniaProvider = class CogniaProvider {
    async generate(params) {
        const systemPrefix = this.getSystemPrefix(params.teacher);
        const lastUser = params.messages.filter((m) => m.role === 'user').at(-1)?.content ?? '';
        switch (params.model) {
            case 'phi3':
                return `【${systemPrefix}】Ответ (phi-3 mock): ${this.simpleAnswer(lastUser)}`;
            case 'gpt':
                return `【${systemPrefix}】Ответ (gpt mock): ${this.simpleAnswer(lastUser)}`;
            case 'llama':
                return `【${systemPrefix}】Ответ (llama mock): ${this.simpleAnswer(lastUser)}`;
            default:
                return `Ответ: ${this.simpleAnswer(lastUser)}`;
        }
    }
    getSystemPrefix(teacher) {
        switch (teacher) {
            case 'math':
                return 'Математика';
            case 'history':
                return 'История';
            case 'languages':
                return 'Языки';
            default:
                return 'Учитель';
        }
    }
    simpleAnswer(input) {
        if (!input)
            return 'Здравствуйте! Чем могу помочь?';
        if (/\d+\s*[+\-*\/]\s*\d+/.test(input)) {
            try {
                const val = eval(input);
                return String(val);
            }
            catch {
                return 'Давайте разберем по шагам.';
            }
        }
        return `Вы спросили: ${input}`;
    }
};
exports.CogniaProvider = CogniaProvider;
exports.CogniaProvider = CogniaProvider = __decorate([
    (0, common_1.Injectable)()
], CogniaProvider);
//# sourceMappingURL=cognia.provider.js.map