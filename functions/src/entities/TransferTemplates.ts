import { Column, Entity } from 'typeorm';

@Entity('transfer_templates', { schema: 'cyclictodo' })
export class TransferTemplates {
  @Column('char', { primary: true, name: 'id', length: 20 })
      id!: string;

  @Column('datetime', { name: 'date' })
      date!: Date;

  @Column('char', { name: 'tab_id', length: 20 })
      tabId!: string;

  @Column('int', { name: 'price' })
      price!: number;

  @Column('text', { name: 'description' })
      description!: string;

  @Column('char', { name: 'from_method', nullable: true, length: 20 })
      fromMethod!: string | null;

  @Column('char', { name: 'to_method', nullable: true, length: 20 })
      toMethod!: string | null;

  @Column('char', { name: 'user_id', length: 28 })
      userId!: string;

  @Column('datetime', { name: 'timestamp' })
      timestamp!: Date;
}