import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('cognia_settings')
export class CogniaSettings {
  @PrimaryColumn({ type: 'varchar', length: 16 })
  id: 'singleton';

  @Column({ type: 'boolean', default: true })
  allowPhi3: boolean;

  @Column({ type: 'boolean', default: false })
  allowGpt: boolean;

  @Column({ type: 'boolean', default: false })
  allowLlama: boolean;
}