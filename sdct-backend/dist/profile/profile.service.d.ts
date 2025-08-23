import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from './transaction.entity';
import { Purchase } from './purchase.entity';
import { Achievement } from './achievement.entity';
export declare class ProfileService {
    private readonly usersRepo;
    private readonly txRepo;
    private readonly purchaseRepo;
    private readonly achievementRepo;
    constructor(usersRepo: Repository<User>, txRepo: Repository<Transaction>, purchaseRepo: Repository<Purchase>, achievementRepo: Repository<Achievement>);
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        nickname: string | null;
        prefix: string | null;
        avatarUrl: string | null;
        theme: string;
        points: number;
        achievements: Achievement[];
        createdAt: Date;
    }>;
    updateProfile(userId: string, data: Partial<Pick<User, 'nickname' | 'prefix' | 'avatarUrl' | 'theme'>>): Promise<{
        id: string;
        email: string;
        nickname: string | null;
        prefix: string | null;
        avatarUrl: string | null;
        theme: string;
        points: number;
        achievements: Achievement[];
        createdAt: Date;
    }>;
    getTransactions(userId: string): Promise<Transaction[]>;
    getPurchases(userId: string): Promise<Purchase[]>;
    getAchievements(userId: string): Promise<Achievement[]>;
}
