import { Column, Entity } from 'typeorm';

@Entity('methods', { schema: 'cyclictodo' })
export class Methods {
  @Column('char', { primary: true, name: 'id', length: 20 })
      id!: string;

  @Column('int', { name: 'timing_date' })
      timingDate!: number;

  @Column('char', { name: 'tab_id', length: 20 })
      tabId!: string;

  @Column('char', { name: 'asset_id', length: 20 })
      assetId!: string;

  @Column('varchar', { name: 'timing', length: 50 })
      timing!: string;

  @Column('char', { name: 'user_id', length: 28 })
      userId!: string;

  @Column('datetime', { name: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      timestamp!: Date;

  @Column('varchar', { name: 'label', length: 100 })
      label!: string;
}