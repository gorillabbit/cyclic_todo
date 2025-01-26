import { Column, Entity } from 'typeorm';

@Entity('accounts', { schema: 'cyclictodo' })
export class Accounts {
  @Column('char', { primary: true, name: 'id', length: 28 })
      id!: string;

  @Column('json', { name: 'receive_request', nullable: true })
      receiveRequest!: object | null;

  @Column('json', { name: 'linked_accounts', nullable: true })
      linkedAccounts!: object | null;

  @Column('varchar', { name: 'name', length: 255 })
      name!: string;

  @Column('text', { name: 'icon' })
      icon!: string;

  @Column('json', { name: 'send_request', nullable: true })
      sendRequest!: object | null;

  @Column('varchar', { name: 'email', length: 255 })
      email!: string;

  @Column('json', { name: 'use_tab_ids', nullable: true })
      useTabIds!: object | null;
}