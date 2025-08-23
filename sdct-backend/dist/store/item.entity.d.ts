export type StoreItemType = 'avatar' | 'prefix' | 'background';
export declare class StoreItem {
    id: string;
    type: StoreItemType;
    name: string;
    description: string | null;
    price: number;
    value: string | null;
    assetUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
