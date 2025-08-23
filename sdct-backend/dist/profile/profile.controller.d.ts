import { ProfileService } from './profile.service';
import type { Response } from 'express';
declare class UpdateProfileDto {
    nickname?: string;
    prefix?: string;
    avatarUrl?: string;
    theme?: string;
}
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    me(req: any): Promise<{
        id: string;
        email: string;
        nickname: string | null;
        prefix: string | null;
        avatarUrl: string | null;
        theme: string;
        points: number;
        achievements: import("./achievement.entity").Achievement[];
    }>;
    updateMe(req: any, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        nickname: string | null;
        prefix: string | null;
        avatarUrl: string | null;
        theme: string;
        points: number;
        achievements: import("./achievement.entity").Achievement[];
    }>;
    transactions(req: any): Promise<import("./transaction.entity").Transaction[]>;
    purchases(req: any): Promise<import("./purchase.entity").Purchase[]>;
    achievements(req: any): Promise<import("./achievement.entity").Achievement[]>;
    asset(req: any, res: Response, itemId: string): Promise<void | Response<any, Record<string, any>>>;
}
export {};
