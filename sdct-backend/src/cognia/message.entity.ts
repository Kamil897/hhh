import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Conversation } from './conversation.entity';

export type CogniaRole = 'system' | 'user' | 'assistant';

@Entity('cognia_messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (c) => c.messages, { onDelete: 'CASCADE' })
  conversation: Conversation;

  @Column({ type: 'varchar', length: 16 })
  role: CogniaRole;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 16, default: 'SDCT' })
  sdctTag: string;

  @CreateDateColumn()
  createdAt: Date;
}