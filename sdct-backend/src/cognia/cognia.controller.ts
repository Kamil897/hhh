import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CogniaService } from './cognia.service';
import { IsIn, IsOptional, IsString } from 'class-validator';

class CreateConvDto {
  @IsIn(['phi3','gpt','llama'])
  model: 'phi3'|'gpt'|'llama';

  @IsIn(['math','history','languages'])
  teacher: 'math'|'history'|'languages';

  @IsOptional()
  @IsString()
  title?: string;
}

class SendMessageDto {
  @IsString()
  content: string;
}

@Controller('cognia')
@UseGuards(JwtAuthGuard)
export class CogniaController {
  constructor(private readonly service: CogniaService) {}

  @Get('conversations')
  list(@Req() req: any) {
    return this.service.listConversations(req.user.sub);
  }

  @Post('conversations')
  create(@Req() req: any, @Body() dto: CreateConvDto) {
    return this.service.createConversation(req.user.sub, dto.model, dto.teacher, dto.title);
  }

  @Get('conversations/:id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.service.getConversation(req.user.sub, id);
  }

  @Post('conversations/:id/messages')
  send(@Req() req: any, @Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.service.sendMessage(req.user.sub, id, dto.content);
  }
}