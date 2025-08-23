import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from '../profile/transaction.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Transaction) private readonly txRepo: Repository<Transaction>,
  ) {}

  async awardPoints(userId: string, amount: number, type: string, description?: string) {
    await this.usersRepo.increment({ id: userId } as any, 'points', amount);
    const tx = this.txRepo.create({ user: { id: userId } as any, amount, type, description: description ?? null });
    await this.txRepo.save(tx);
  }
}