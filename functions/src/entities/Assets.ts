import { Column, Entity } from 'typeorm';

@Entity('assets', { schema: 'cyclictodo' })
export class Assets {
  @Column('char', { primary: true, name: 'id', length: 20 })
      id!: string;

  @Column('char', { name: 'tab_id', length: 20 })
      tabId!: string;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
      name!: string | null;

  @Column('char', { name: 'user_id', length: 28 })
      userId!: string;

  @Column('datetime', { name: 'timestamp', nullable: true })
      timestamp!: Date | null;
}