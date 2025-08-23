import { Transaction } from '../profile/transaction.entity';
import { Purchase } from '../profile/purchase.entity';
import { Achievement } from '../profile/achievement.entity';
export type UserRole = 'user' | 'admin' | 'super-admin';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    nickname: string | null;
    prefix: string | null;
    avatarUrl: string | null;
    theme: string;
    points: number;
    transactions: Transaction[];
    purchases: Purchase[];
    achievements: Achievement[];
    createdAt: Date;
    updatedAt: Date;
}
