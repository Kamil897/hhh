import { Body, Controller, Get, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ProfileService } from './profile.service';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import type { Response } from 'express';

class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  nickname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  prefix?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(512)
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  theme?: string;
}

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  me(@Req() req: any) {
    return this.profileService.getProfile(req.user.sub);
  }

  @Put('me')
  updateMe(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.sub, dto);
  }

  @Get('transactions')
  transactions(@Req() req: any) {
    return this.profileService.getTransactions(req.user.sub);
  }

  @Get('purchases')
  purchases(@Req() req: any) {
    return this.profileService.getPurchases(req.user.sub);
  }

  @Get('achievements')
  achievements(@Req() req: any) {
    return this.profileService.getAchievements(req.user.sub);
  }

  // Controlled asset access by purchase; returns 403-like behavior by not serving asset when not purchased
  @Get('asset')
  async asset(@Req() req: any, @Res() res: Response, @Query('itemId') itemId: string) {
    const purchases = await this.profileService.getPurchases(req.user.sub);
    const purchase = purchases.find((p: any) => p.itemId === itemId);
    if (!purchase || !purchase.assetUrl) {
      return res.status(403).json({ message: 'Asset not available' });
    }
    // For now, redirect to asset URL; in production serve via signed URL or proxy stream
    return res.redirect(purchase.assetUrl);
  }
}