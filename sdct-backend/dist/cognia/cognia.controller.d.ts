import { CogniaService } from './cognia.service';
declare class CreateConvDto {
    model: 'phi3' | 'gpt' | 'llama';
    teacher: 'math' | 'history' | 'languages';
    title?: string;
}
declare class SendMessageDto {
    content: string;
}
export declare class CogniaController {
    private readonly service;
    constructor(service: CogniaService);
    list(req: any): Promise<import("./conversation.entity").Conversation[]>;
    create(req: any, dto: CreateConvDto): Promise<import("./conversation.entity").Conversation>;
    get(req: any, id: string): Promise<import("./conversation.entity").Conversation>;
    send(req: any, id: string, dto: SendMessageDto): Promise<{
        assistant: {
            content: string;
            id: string;
            conversation: import("./conversation.entity").Conversation;
            role: import("./message.entity").CogniaRole;
            sdctTag: string;
            createdAt: Date;
        };
    }>;
}
export {};
