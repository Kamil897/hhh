import { StoreService } from './store.service';
export declare class StoreController {
    private readonly storeService;
    constructor(storeService: StoreService);
    items(type?: string): Promise<import("./item.entity").StoreItem[]>;
    purchase(req: any, itemId: string): Promise<import("../profile/purchase.entity").Purchase>;
    use(req: any, itemId: string): Promise<{
        ok: boolean;
    }>;
}
