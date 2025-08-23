import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Message } from './message.entity';

export type CogniaModel = 'phi3' | 'gpt' | 'llama';
export type CogniaTeacher = 'math' | 'history' | 'languages';

@Entity('cognia_conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 64, nullable: true })
  title: string | null;

  @Column({ type: 'varchar', length: 16 })
  model: CogniaModel;

  @Column({ type: 'varchar', length: 16 })
  teacher: CogniaTeacher;

  @OneToMany(() => Message, (m) => m.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}