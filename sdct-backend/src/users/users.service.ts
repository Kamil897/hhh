import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async createUser(params: { email: string; passwordHash: string; role?: UserRole }): Promise<User> {
    const user = this.usersRepository.create({
      email: params.email,
      passwordHash: params.passwordHash,
      role: params.role ?? 'user',
    });
    return this.usersRepository.save(user);
  }
}
