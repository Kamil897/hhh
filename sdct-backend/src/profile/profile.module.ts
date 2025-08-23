import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';
import { Transaction } from './transaction.entity';
import { Purchase } from './purchase.entity';
import { Achievement } from './achievement.entity';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction, Purchase, Achievement]), UsersModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}