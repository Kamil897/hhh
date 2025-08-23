import { Injectable } from '@nestjs/common';
import { CogniaModel, CogniaTeacher } from './conversation.entity';

@Injectable()
export class CogniaProvider {
  async generate(params: {
    model: CogniaModel;
    teacher: CogniaTeacher;
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  }): Promise<string> {
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

  private getSystemPrefix(teacher: CogniaTeacher): string {
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

  private simpleAnswer(input: string): string {
    if (!input) return 'Здравствуйте! Чем могу помочь?';
    if (/\d+\s*[+\-*\/]\s*\d+/.test(input)) {
      try {
        // naive eval for simple expressions
        // eslint-disable-next-line no-eval
        const val = eval(input);
        return String(val);
      } catch {
        return 'Давайте разберем по шагам.';
      }
    }
    return `Вы спросили: ${input}`;
  }
}