import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

export type ComplaintStatus = 'open' | 'resolved' | 'rejected';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  author: User | null;

  @Column({ type: 'varchar', length: 128 })
  category: string; // e.g., user, content, bug

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar', length: 16, default: 'SDCT' })
  sdctTag: string;

  @Column({ type: 'varchar', length: 16, default: 'open' })
  status: ComplaintStatus;

  @CreateDateColumn()
  createdAt: Date;
}