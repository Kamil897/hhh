import { User } from '../users/user.entity';
export declare class Achievement {
    id: string;
    code: string;
    title: string;
    description: string | null;
    users: User[];
}
