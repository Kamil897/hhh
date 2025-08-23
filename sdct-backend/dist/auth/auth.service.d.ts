import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(email: string, password: string): Promise<{
        access_token: string;
    }>;
    validateUser(email: string, password: string): Promise<import("../users/user.entity").User | null>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
    private signToken;
}
