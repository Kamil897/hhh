import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, CogniaModel, CogniaTeacher } from './conversation.entity';
import { Message, CogniaRole } from './message.entity';
import { CogniaProvider } from './cognia.provider';
import { SdctCryptoService } from '../sdct/sdct-crypto.service';

@Injectable()
export class CogniaService {
  constructor(
    @InjectRepository(Conversation) private readonly convRepo: Repository<Conversation>,
    @InjectRepository(Message) private readonly msgRepo: Repository<Message>,
    private readonly provider: CogniaProvider,
    private readonly crypto: SdctCryptoService,
  ) {}

  async listConversations(userId: string) {
    return this.convRepo.find({ where: { user: { id: userId } as any }, order: { updatedAt: 'DESC' } });
  }

  async getConversation(userId: string, id: string) {
    const conv = await this.convRepo.findOne({ where: { id, user: { id: userId } as any }, relations: ['messages'] });
    if (!conv) throw new NotFoundException('Conversation not found');
    // decrypt messages on read
    conv.messages = conv.messages.map((m) => ({ ...m, content: this.crypto.decrypt(m.content) } as any));
    return conv;
  }

  async createConversation(userId: string, model: CogniaModel, teacher: CogniaTeacher, title?: string) {
    const conv = this.convRepo.create({ user: { id: userId } as any, model, teacher, title: title ?? null });
    return this.convRepo.save(conv);
  }

  async sendMessage(userId: string, convId: string, content: string) {
    const conv = await this.getConversation(userId, convId);
    const encUser = this.crypto.encrypt(content);
    const userMsg = this.msgRepo.create({ conversation: { id: conv.id } as any, role: 'user', content: encUser });
    await this.msgRepo.save(userMsg);

    const history = await this.msgRepo.find({ where: { conversation: { id: conv.id } as any }, order: { createdAt: 'ASC' } });
    const assistantText = await this.provider.generate({ model: conv.model, teacher: conv.teacher, messages: history.map(m => ({ role: m.role as CogniaRole, content: this.crypto.decrypt(m.content) })) });
    const encAssistant = this.crypto.encrypt(assistantText);
    const assistantMsg = this.msgRepo.create({ conversation: { id: conv.id } as any, role: 'assistant', content: encAssistant });
    await this.msgRepo.save(assistantMsg);
    await this.convRepo.update({ id: conv.id }, { updatedAt: new Date() } as any);

    return { assistant: { ...assistantMsg, content: assistantText } };
  }
}