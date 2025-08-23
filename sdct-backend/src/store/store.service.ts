import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreItem } from './item.entity';
import { UsersService } from '../users/users.service';
import { Purchase } from '../profile/purchase.entity';
import { Transaction } from '../profile/transaction.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreItem) private readonly storeRepo: Repository<StoreItem>,
    @InjectRepository(Purchase) private readonly purchaseRepo: Repository<Purchase>,
    @InjectRepository(Transaction) private readonly txRepo: Repository<Transaction>,
    private readonly usersService: UsersService,
  ) {}

  listActive() {
    return this.storeRepo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  }

  async purchase(userId: string, itemId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const item = await this.storeRepo.findOne({ where: { id: itemId, isActive: true } });
    if (!item) throw new NotFoundException('Item not found');

    // Check already purchased (idempotent)
    const existing = await this.purchaseRepo.findOne({ where: { user: { id: userId } as any, itemId: item.id } });
    if (existing) return existing;

    if (user.points < item.price) throw new BadRequestException('Not enough points');

    // Deduct points
    await this.usersService['usersRepository'].decrement({ id: userId } as any, 'points', item.price);

    // Record transaction
    const tx = this.txRepo.create({ user: { id: userId } as any, amount: -item.price, type: 'purchase', description: item.name });
    await this.txRepo.save(tx);

    // Create purchase
    const purchase = this.purchaseRepo.create({ user: { id: userId } as any, itemId: item.id, itemName: item.name, price: item.price, assetUrl: item.assetUrl ?? null });
    await this.purchaseRepo.save(purchase);

    // Apply effect
    await this.applyItemEffect(userId, item);

    return purchase;
  }

  async useItem(userId: string, itemId: string) {
    const item = await this.storeRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Item not found');
    const owned = await this.purchaseRepo.findOne({ where: { user: { id: userId } as any, itemId: item.id } });
    if (!owned) throw new BadRequestException('Item not owned');
    await this.applyItemEffect(userId, item);
    return { ok: true };
  }

  private async applyItemEffect(userId: string, item: StoreItem) {
    switch (item.type) {
      case 'prefix':
        await this.usersService['usersRepository'].update({ id: userId } as any, { prefix: item.value ?? null });
        break;
      case 'background':
        await this.usersService['usersRepository'].update({ id: userId } as any, { theme: item.value ?? 'light' });
        break;
      case 'avatar':
        await this.usersService['usersRepository'].update({ id: userId } as any, { avatarUrl: item.assetUrl ?? null });
        break;
      default:
        break;
    }
  }
}