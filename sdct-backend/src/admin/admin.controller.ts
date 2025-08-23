import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { StoreItem } from '../store/item.entity';
import { Conversation } from '../cognia/conversation.entity';
import { Message } from '../cognia/message.entity';
import { CogniaSettings } from '../cognia/settings.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(StoreItem) private readonly storeRepo: Repository<StoreItem>,
    @InjectRepository(CogniaSettings) private readonly settingsRepo: Repository<CogniaSettings>,
  ) {}

  // Users
  @Roles('admin', 'super-admin')
  @Get('users')
  listUsers() {
    return this.usersRepo.find({ order: { createdAt: 'DESC' } });
  }

  @Roles('admin', 'super-admin')
  @Post('users/:id/ban')
  async ban(@Param('id') id: string) { await this.usersRepo.update({ id }, { isBanned: true }); return { ok: true }; }

  @Roles('admin', 'super-admin')
  @Post('users/:id/mute')
  async mute(@Param('id') id: string) { await this.usersRepo.update({ id }, { isMuted: true }); return { ok: true }; }

  @Roles('admin', 'super-admin')
  @Post('users/:id/unban')
  async unban(@Param('id') id: string) { await this.usersRepo.update({ id }, { isBanned: false, isMuted: false }); return { ok: true }; }

  @Roles('super-admin')
  @Post('users/:id/role')
  async setRole(@Param('id') id: string, @Body() body: { role: UserRole }) {
    await this.usersRepo.update({ id }, { role: body.role });
    return { ok: true };
  }

  // Store management
  @Roles('admin', 'super-admin')
  @Get('store/items')
  storeItems() { return this.storeRepo.find({ order: { createdAt: 'DESC' } }); }

  @Roles('admin', 'super-admin')
  @Post('store/items')
  createItem(@Body() body: Partial<StoreItem>) { const item = this.storeRepo.create(body); return this.storeRepo.save(item); }

  @Roles('admin', 'super-admin')
  @Put('store/items/:id')
  updateItem(@Param('id') id: string, @Body() body: Partial<StoreItem>) { return this.storeRepo.update({ id }, body); }

  @Roles('admin', 'super-admin')
  @Delete('store/items/:id')
  deleteItem(@Param('id') id: string) { return this.storeRepo.delete({ id }); }

  // Cognia settings
  @Roles('super-admin')
  @Get('cognia/settings')
  async getCognia() {
    const s = await this.settingsRepo.findOne({ where: { id: 'singleton' } });
    return s ?? { id: 'singleton', allowPhi3: true, allowGpt: false, allowLlama: false };
  }

  @Roles('super-admin')
  @Put('cognia/settings')
  async setCognia(@Body() body: Partial<CogniaSettings>) {
    let s = await this.settingsRepo.findOne({ where: { id: 'singleton' } });
    if (!s) s = this.settingsRepo.create({ id: 'singleton', allowPhi3: true, allowGpt: false, allowLlama: false });
    Object.assign(s, body);
    await this.settingsRepo.save(s);
    return s;
  }
}