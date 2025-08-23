import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.purchases, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 128 })
  itemId: string; // store/catalog item identifier

  @Column({ type: 'varchar', length: 256 })
  itemName: string;

  @Column({ type: 'int', default: 0 })
  price: number; // points or currency, flexible

  @Column({ type: 'varchar', length: 512, nullable: true })
  assetUrl: string | null; // not directly downloadable via public endpoint

  @CreateDateColumn()
  createdAt: Date;
}