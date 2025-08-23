import { Repository } from 'typeorm';
import { StoreItem } from './item.entity';
import { UsersService } from '../users/users.service';
import { Purchase } from '../profile/purchase.entity';
import { Transaction } from '../profile/transaction.entity';
export declare class StoreService {
    private readonly storeRepo;
    private readonly purchaseRepo;
    private readonly txRepo;
    private readonly usersService;
    constructor(storeRepo: Repository<StoreItem>, purchaseRepo: Repository<Purchase>, txRepo: Repository<Transaction>, usersService: UsersService);
    listActive(): Promise<StoreItem[]>;
    purchase(userId: string, itemId: string): Promise<Purchase>;
    private applyItemEffect;
}
