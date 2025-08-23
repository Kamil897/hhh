import { User } from '../users/user.entity';
import { Message } from './message.entity';
export type CogniaModel = 'phi3' | 'gpt' | 'llama';
export type CogniaTeacher = 'math' | 'history' | 'languages';
export declare class Conversation {
    id: string;
    user: User;
    title: string | null;
    model: CogniaModel;
    teacher: CogniaTeacher;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}
