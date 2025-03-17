import { Column, Entity } from 'typeorm';

@Entity('purchase_templates', { schema: 'cyclictodo' })
export class PurchaseTemplates {
  @Column('char', { primary: true, name: 'id', length: 20 })
      id!: string;

  @Column('datetime', { name: 'date' })
      date!: Date;

  @Column('tinyint', { name: 'income', width: 1 })
      income!: boolean;

  @Column('char', { name: 'tab_id', nullable: true, length: 20 })
      tabId!: string | null;

  @Column('char', { name: 'method', length: 20 })
      method!: string;

  @Column('text', { name: 'description' })
      description!: string;

  @Column('varchar', { name: 'title', length: 255 })
      title!: string;

  @Column('char', { name: 'user_id', length: 28 })
      userId!: string;

  @Column('int', { name: 'price' })
      price!: number;

  @Column('tinyint', {
      name: 'is_uncertain',
      nullable: true,
      width: 1,
      default: () => '\'0\'',
  })
      isUncertain!: boolean | null;

  @Column('tinyint', {
      name: 'is_group',
      nullable: true,
      width: 1,
      default: () => '\'0\'',
  })
      isGroup!: boolean | null;

  @Column('varchar', { name: 'category', length: 100 })
      category!: string;

  @Column('datetime', { name: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      timestamp!: Date;
}