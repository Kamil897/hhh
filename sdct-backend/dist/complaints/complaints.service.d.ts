import { Repository } from 'typeorm';
import { Complaint, ComplaintStatus } from './complaint.entity';
import { SdctCryptoService } from '../sdct/sdct-crypto.service';
export declare class ComplaintsService {
    private readonly repo;
    private readonly crypto;
    constructor(repo: Repository<Complaint>, crypto: SdctCryptoService);
    create(authorId: string, category: string, text: string): Promise<Complaint>;
    list(status?: ComplaintStatus): Promise<any[]>;
    updateStatus(id: string, status: ComplaintStatus): Promise<import("typeorm").UpdateResult>;
}
