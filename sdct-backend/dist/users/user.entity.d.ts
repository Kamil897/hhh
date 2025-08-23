export type UserRole = 'user' | 'admin' | 'super-admin';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
