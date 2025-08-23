import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { StoreItem } from '../store/item.entity';
import { CogniaSettings } from '../cognia/settings.entity';
export declare class AdminController {
    private readonly usersRepo;
    private readonly storeRepo;
    private readonly settingsRepo;
    constructor(usersRepo: Repository<User>, storeRepo: Repository<StoreItem>, settingsRepo: Repository<CogniaSettings>);
    listUsers(): Promise<User[]>;
    ban(id: string): Promise<{
        ok: boolean;
    }>;
    mute(id: string): Promise<{
        ok: boolean;
    }>;
    unban(id: string): Promise<{
        ok: boolean;
    }>;
    setRole(id: string, body: {
        role: UserRole;
    }): Promise<{
        ok: boolean;
    }>;
    storeItems(): Promise<StoreItem[]>;
    createItem(body: Partial<StoreItem>): Promise<StoreItem>;
    updateItem(id: string, body: Partial<StoreItem>): Promise<import("typeorm").UpdateResult>;
    deleteItem(id: string): Promise<import("typeorm").DeleteResult>;
    getCognia(): Promise<CogniaSettings>;
    setCognia(body: Partial<CogniaSettings>): Promise<CogniaSettings>;
}
