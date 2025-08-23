import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.transactions, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int' })
  amount: number; // positive or negative

  @Column({ type: 'varchar', length: 128 })
  type: string; // e.g., purchase, reward, admin_adjust

  @Column({ type: 'varchar', length: 512, nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;
}