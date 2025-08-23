import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from './transaction.entity';
import { Purchase } from './purchase.entity';
import { Achievement } from './achievement.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Transaction) private readonly txRepo: Repository<Transaction>,
    @InjectRepository(Purchase) private readonly purchaseRepo: Repository<Purchase>,
    @InjectRepository(Achievement) private readonly achievementRepo: Repository<Achievement>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['achievements'] });
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      prefix: user.prefix,
      avatarUrl: user.avatarUrl,
      theme: user.theme,
      points: user.points,
      achievements: user.achievements,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, data: Partial<Pick<User, 'nickname' | 'prefix' | 'avatarUrl' | 'theme'>>) {
    await this.usersRepo.update({ id: userId }, data);
    return this.getProfile(userId);
  }

  async getTransactions(userId: string) {
    return this.txRepo.find({ where: { user: { id: userId } as any }, order: { createdAt: 'DESC' } });
  }

  async getPurchases(userId: string) {
    return this.purchaseRepo.find({ where: { user: { id: userId } as any }, order: { createdAt: 'DESC' } });
  }

  async getAchievements(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['achievements'] });
    if (!user) throw new NotFoundException('User not found');
    return user.achievements;
  }
}