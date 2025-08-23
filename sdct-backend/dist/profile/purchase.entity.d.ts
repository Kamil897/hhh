import { User } from '../users/user.entity';
export declare class Purchase {
    id: string;
    user: User;
    itemId: string;
    itemName: string;
    price: number;
    assetUrl: string | null;
    createdAt: Date;
}
