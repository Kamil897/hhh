import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';
import { CogniaService } from './cognia.service';
import { CogniaController } from './cognia.controller';
import { CogniaProvider } from './cognia.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message])],
  providers: [CogniaService, CogniaProvider],
  controllers: [CogniaController],
})
export class CogniaModule {}