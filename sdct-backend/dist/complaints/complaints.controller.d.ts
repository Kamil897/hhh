import { ComplaintsService } from './complaints.service';
export declare class ComplaintsController {
    private readonly service;
    constructor(service: ComplaintsService);
    create(req: any, body: {
        category: string;
        text: string;
    }): Promise<import("./complaint.entity").Complaint>;
    list(status?: 'open' | 'resolved' | 'rejected'): Promise<any[]>;
    resolve(id: string): Promise<import("typeorm").UpdateResult>;
    reject(id: string): Promise<import("typeorm").UpdateResult>;
}
