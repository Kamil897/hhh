import { CogniaModel, CogniaTeacher } from './conversation.entity';
export declare class CogniaProvider {
    generate(params: {
        model: CogniaModel;
        teacher: CogniaTeacher;
        messages: {
            role: 'system' | 'user' | 'assistant';
            content: string;
        }[];
    }): Promise<string>;
    private getSystemPrefix;
    private simpleAnswer;
}
