import { Column, Entity } from 'typeorm';

@Entity('purchases', { schema: 'cyclictodo' })
export class Purchases {
  @Column('char', { primary: true, name: 'id', length: 20 })
      id!: string;

  @Column('datetime', { name: 'date' })
      date!: Date;

  @Column('tinyint', {
      name: 'income',
      nullable: true,
      width: 1,
      default: () => '\'0\'',
  })
      income!: boolean | null;

  @Column('char', { name: 'tab_id', length: 20 })
      tabId!: string;

  @Column('char', { name: 'method', length: 20 })
      method!: string;

  @Column('int', { name: 'price', nullable: true, default: () => '\'0\'' })
      price!: number | null;

  @Column('text', { name: 'description' })
      description!: string;

  @Column('varchar', { name: 'title', length: 255 })
      title!: string;

  @Column('varchar', { name: 'category', nullable: true, length: 100 })
      category!: string | null;

  @Column('char', { name: 'user_id', length: 28 })
      userId!: string;

  @Column('char', { name: 'child_purchase_id', nullable: true, length: 20 })
      childPurchaseId!: string | null;

  @Column('int', { name: 'difference', nullable: true })
      difference!: number | null;

  @Column('char', { name: 'asset_id', length: 20 })
      assetId!: string;

  @Column('datetime', { name: 'pay_date', nullable: true })
      payDate!: Date | null;

  @Column('int', { name: 'balance', nullable: true })
      balance!: number | null;

  @Column('tinyint', { name: 'is_uncertain', nullable: true, width: 1 })
      isUncertain!: boolean | null;

  @Column('tinyint', { name: 'is_group', nullable: true, width: 1 })
      isGroup!: boolean | null;

  @Column('char', { name: 'parent_purchase_id', nullable: true, length: 20 })
      parentPurchaseId!: string | null;

  @Column('datetime', {
      name: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
  })
      timestamp!: Date;
}