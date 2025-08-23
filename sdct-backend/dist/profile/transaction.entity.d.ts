import { User } from '../users/user.entity';
export declare class Transaction {
    id: string;
    user: User;
    amount: number;
    type: string;
    description: string | null;
    createdAt: Date;
}
