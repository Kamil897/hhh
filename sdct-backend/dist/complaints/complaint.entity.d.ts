import { User } from '../users/user.entity';
export type ComplaintStatus = 'open' | 'resolved' | 'rejected';
export declare class Complaint {
    id: string;
    author: User | null;
    category: string;
    text: string;
    status: ComplaintStatus;
    createdAt: Date;
}
