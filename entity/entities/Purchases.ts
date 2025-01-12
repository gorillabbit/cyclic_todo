import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Assets } from "./Assets";
import { Methods } from "./Methods";
import { Tabs } from "./Tabs";
import { Accounts } from "./Accounts";

@Index("fk_purchases_user", ["userId"], {})
@Index("fk_purchases_tab", ["tabId"], {})
@Index("fk_purchases_asset", ["assetId"], {})
@Index("fk_purchases_method", ["method"], {})
@Entity("purchases", { schema: "cyclictodo" })
export class Purchases {
  @Column("char", { primary: true, name: "id", length: 20 })
  id: string;

  @Column("datetime", { name: "date" })
  date: Date;

  @Column("tinyint", {
    name: "income",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  income: boolean | null;

  @Column("char", { name: "tab_id", length: 20 })
  tabId: string;

  @Column("char", { name: "method", length: 20 })
  method: string;

  @Column("int", { name: "price", nullable: true, default: () => "'0'" })
  price: number | null;

  @Column("text", { name: "description" })
  description: string;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("varchar", { name: "category", nullable: true, length: 100 })
  category: string | null;

  @Column("char", { name: "user_id", length: 20 })
  userId: string;

  @Column("char", { name: "child_purchase_id", nullable: true, length: 20 })
  childPurchaseId: string | null;

  @Column("int", { name: "difference", nullable: true })
  difference: number | null;

  @Column("char", { name: "asset_id", length: 20 })
  assetId: string;

  @Column("datetime", { name: "pay_date", nullable: true })
  payDate: Date | null;

  @Column("int", { name: "balance", nullable: true })
  balance: number | null;

  @Column("datetime", {
    name: "timestamp",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  timestamp: Date | null;

  @ManyToOne(() => Assets, (assets) => assets.purchases, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "asset_id", referencedColumnName: "id" }])
  asset: Assets;

  @ManyToOne(() => Methods, (methods) => methods.purchases, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "method", referencedColumnName: "id" }])
  method2: Methods;

  @ManyToOne(() => Tabs, (tabs) => tabs.purchases, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tab_id", referencedColumnName: "id" }])
  tab: Tabs;

  @ManyToOne(() => Accounts, (accounts) => accounts.purchases, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Accounts;
}
