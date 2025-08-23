import { Repository } from 'typeorm';
import { Conversation, CogniaModel, CogniaTeacher } from './conversation.entity';
import { Message, CogniaRole } from './message.entity';
import { CogniaProvider } from './cognia.provider';
import { SdctCryptoService } from '../sdct/sdct-crypto.service';
export declare class CogniaService {
    private readonly convRepo;
    private readonly msgRepo;
    private readonly provider;
    private readonly crypto;
    constructor(convRepo: Repository<Conversation>, msgRepo: Repository<Message>, provider: CogniaProvider, crypto: SdctCryptoService);
    listConversations(userId: string): Promise<Conversation[]>;
    getConversation(userId: string, id: string): Promise<Conversation>;
    createConversation(userId: string, model: CogniaModel, teacher: CogniaTeacher, title?: string): Promise<Conversation>;
    sendMessage(userId: string, convId: string, content: string): Promise<{
        assistant: {
            content: string;
            id: string;
            conversation: Conversation;
            role: CogniaRole;
            sdctTag: string;
            createdAt: Date;
        };
    }>;
}
