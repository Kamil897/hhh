import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type StoreItemType = 'avatar' | 'prefix' | 'background';

@Entity('store_items')
export class StoreItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32 })
  type: StoreItemType;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 0 })
  price: number; // points cost

  @Column({ type: 'varchar', length: 512, nullable: true })
  value: string | null; // prefix text or theme key

  @Column({ type: 'varchar', length: 512, nullable: true })
  assetUrl: string | null; // for avatar or downloadable asset

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}