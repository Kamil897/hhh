import { Column, CreateDateColumn, Entity, OneToMany, ManyToMany, JoinTable, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Transaction } from '../profile/transaction.entity';
import { Purchase } from '../profile/purchase.entity';
import { Achievement } from '../profile/achievement.entity';

export type UserRole = 'user' | 'admin' | 'super-admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', length: 32, default: 'user' })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @Column({ type: 'boolean', default: false })
  isMuted: boolean;

  @Column({ type: 'varchar', length: 64, nullable: true })
  nickname: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  prefix: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'varchar', length: 32, default: 'light' })
  theme: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @OneToMany(() => Transaction, (t) => t.user)
  transactions: Transaction[];

  @OneToMany(() => Purchase, (p) => p.user)
  purchases: Purchase[];

  @ManyToMany(() => Achievement, (a) => a.users, { cascade: true })
  @JoinTable({ name: 'user_achievements' })
  achievements: Achievement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}