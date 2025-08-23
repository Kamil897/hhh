import { Repository } from 'typeorm';
import { Complaint, ComplaintStatus } from './complaint.entity';
export declare class ComplaintsService {
    private readonly repo;
    constructor(repo: Repository<Complaint>);
    create(authorId: string, category: string, text: string): Promise<Complaint>;
    list(status?: ComplaintStatus): Promise<Complaint[]>;
    updateStatus(id: string, status: ComplaintStatus): Promise<import("typeorm").UpdateResult>;
}
