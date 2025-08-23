import { Repository } from 'typeorm';
import { Conversation, CogniaModel, CogniaTeacher } from './conversation.entity';
import { Message } from './message.entity';
import { CogniaProvider } from './cognia.provider';
export declare class CogniaService {
    private readonly convRepo;
    private readonly msgRepo;
    private readonly provider;
    constructor(convRepo: Repository<Conversation>, msgRepo: Repository<Message>, provider: CogniaProvider);
    listConversations(userId: string): Promise<Conversation[]>;
    getConversation(userId: string, id: string): Promise<Conversation>;
    createConversation(userId: string, model: CogniaModel, teacher: CogniaTeacher, title?: string): Promise<Conversation>;
    sendMessage(userId: string, convId: string, content: string): Promise<{
        assistant: Message;
    }>;
}
