import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(req: any): {
        user: any;
    };
    adminOnly(): {
        ok: boolean;
    };
}
