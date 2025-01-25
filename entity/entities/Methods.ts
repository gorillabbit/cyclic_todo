import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Accounts } from "./Accounts.js";
import { Assets } from "./Assets.js";
import { Purchases } from "./Purchases.js";
import { PurchaseSchedules } from "./PurchaseSchedules.js";
import { PurchaseTemplates } from "./PurchaseTemplates.js";
import { Tabs } from "./Tabs.js";
import { TransferTemplates } from "./TransferTemplates.js";

@Index("fk_methods_user", ["user_id"], {})
@Index("fk_methods_tab", ["tab_id"], {})
@Index("fk_methods_asset", ["asset_id"], {})
@Entity("methods", { schema: "cyclictodo" })
export class Methods {
  @Column("char", { primary: true, name: "id", length: 20 })
  id!: string;

  @Column("int", { name: "timing_date" })
  timing_date!: number;

  @Column("char", { name: "tab_id", length: 20 })
  tab_id!: string;

  @Column("char", { name: "asset_id", length: 20 })
  asset_id!: string;

  @Column("varchar", { name: "timing", length: 50 })
  timing!: string;

  @Column("char", { name: "user_id", length: 20 })
  user_id!: string;

  @Column("datetime", { name: "timestamp", nullable: true })
  timestamp!: Date | null;

  @Column("varchar", { name: "label", length: 100 })
  label!: string;

  @ManyToOne(() => Assets, (assets) => assets.methods, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "asset_id", referencedColumnName: "id" }])
  asset!: Assets;

  @ManyToOne(() => Tabs, (tabs) => tabs.methods, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tab_id", referencedColumnName: "id" }])
  tab!: Tabs;

  @ManyToOne(() => Accounts, (accounts) => accounts.methods, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user!: Accounts;

  @OneToMany(
    () => PurchaseSchedules,
    (purchaseSchedules) => purchaseSchedules.method2
  )
  purchaseSchedules!: PurchaseSchedules[];

  @OneToMany(
    () => PurchaseTemplates,
    (purchaseTemplates) => purchaseTemplates.method2
  )
  purchaseTemplates!: PurchaseTemplates[];

  @OneToMany(() => Purchases, (purchases) => purchases.method2)
  purchases!: Purchases[];

  @OneToMany(
    () => TransferTemplates,
    (transferTemplates) => transferTemplates.fromMethod2
  )
  transferTemplates!: TransferTemplates[];

  @OneToMany(
    () => TransferTemplates,
    (transferTemplates) => transferTemplates.toMethod2
  )
  transferTemplates2!: TransferTemplates[];
}