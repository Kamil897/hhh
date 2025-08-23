import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly service: ComplaintsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() body: { category: string; text: string }) {
    return this.service.create(req.user.sub, body.category, body.text);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super-admin')
  @Get()
  list(@Query('status') status?: 'open'|'resolved'|'rejected') {
    return this.service.list(status as any);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super-admin')
  @Post(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.service.updateStatus(id, 'resolved');
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super-admin')
  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.service.updateStatus(id, 'rejected');
  }
}