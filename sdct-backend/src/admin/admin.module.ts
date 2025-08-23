import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { User } from '../users/user.entity';
import { StoreItem } from '../store/item.entity';
import { CogniaSettings } from '../cognia/settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, StoreItem, CogniaSettings])],
  controllers: [AdminController],
})
export class AdminModule {}