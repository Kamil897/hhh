import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from '../profile/transaction.entity';
export declare class GamesService {
    private readonly usersRepo;
    private readonly txRepo;
    constructor(usersRepo: Repository<User>, txRepo: Repository<Transaction>);
    awardPoints(userId: string, amount: number, type: string, description?: string): Promise<void>;
}
