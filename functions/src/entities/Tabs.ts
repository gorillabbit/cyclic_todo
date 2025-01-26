import { Column, Entity } from 'typeorm';

@Entity('tabs', { schema: 'cyclictodo' })
export class Tabs {
  @Column('char', { primary: true, name: 'id', length: 20 })
      id!: string;

  @Column('varchar', { name: 'name', length: 255 })
      name!: string;

  @Column('char', { name: 'create_user_uid', length: 28 })
      createUserUid!: string;

  @Column('json', { name: 'shared_accounts' })
      sharedAccounts!: object;

  @Column('varchar', { name: 'type', length: 50 })
      type!: string;

  @Column('datetime', { name: 'timestamp' })
      timestamp!: Date;

  @Column('char', { name: 'user_id', nullable: true, length: 28 })
      userId!: string | null;
}