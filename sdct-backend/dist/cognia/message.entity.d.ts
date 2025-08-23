import { Conversation } from './conversation.entity';
export type CogniaRole = 'system' | 'user' | 'assistant';
export declare class Message {
    id: string;
    conversation: Conversation;
    role: CogniaRole;
    content: string;
    sdctTag: string;
    createdAt: Date;
}
