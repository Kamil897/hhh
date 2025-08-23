import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreItem } from './item.entity';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { UsersModule } from '../users/users.module';
import { Purchase } from '../profile/purchase.entity';
import { Transaction } from '../profile/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreItem, Purchase, Transaction]), UsersModule],
  providers: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {}