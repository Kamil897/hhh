import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('items')
  items(@Query('type') type?: string) {
    return this.storeService.listActive().then((items) => (type ? items.filter((i: any) => i.type === type) : items));
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase/:itemId')
  purchase(@Req() req: any, @Param('itemId') itemId: string) {
    return this.storeService.purchase(req.user.sub, itemId);
  }
}