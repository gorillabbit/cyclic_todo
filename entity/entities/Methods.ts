import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Assets } from "./Assets";
import { Tabs } from "./Tabs";
import { Accounts } from "./Accounts";
import { PurchaseSchedules } from "./PurchaseSchedules";
import { PurchaseTemplates } from "./PurchaseTemplates";
import { Purchases } from "./Purchases";
import { TransferTemplates } from "./TransferTemplates";

@Index("fk_methods_user", ["userId"], {})
@Index("fk_methods_tab", ["tabId"], {})
@Index("fk_methods_asset", ["assetId"], {})
@Entity("methods", { schema: "cyclictodo" })
export class Methods {
  @Column("char", { primary: true, name: "id", length: 20 })
  id: string;

  @Column("int", { name: "timing_date" })
  timingDate: number;

  @Column("char", { name: "tab_id", length: 20 })
  tabId: string;

  @Column("char", { name: "asset_id", length: 20 })
  assetId: string;

  @Column("varchar", { name: "timing", length: 50 })
  timing: string;

  @Column("char", { name: "user_id", length: 20 })
  userId: string;

  @Column("datetime", { name: "timestamp", nullable: true })
  timestamp: Date | null;

  @Column("varchar", { name: "label", length: 100 })
  label: string;

  @ManyToOne(() => Assets, (assets) => assets.methods, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "asset_id", referencedColumnName: "id" }])
  asset: Assets;

  @ManyToOne(() => Tabs, (tabs) => tabs.methods, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tab_id", referencedColumnName: "id" }])
  tab: Tabs;

  @ManyToOne(() => Accounts, (accounts) => accounts.methods, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Accounts;

  @OneToMany(
    () => PurchaseSchedules,
    (purchaseSchedules) => purchaseSchedules.method2
  )
  purchaseSchedules: PurchaseSchedules[];

  @OneToMany(
    () => PurchaseTemplates,
    (purchaseTemplates) => purchaseTemplates.method2
  )
  purchaseTemplates: PurchaseTemplates[];

  @OneToMany(() => Purchases, (purchases) => purchases.method2)
  purchases: Purchases[];

  @OneToMany(
    () => TransferTemplates,
    (transferTemplates) => transferTemplates.fromMethod2
  )
  transferTemplates: TransferTemplates[];

  @OneToMany(
    () => TransferTemplates,
    (transferTemplates) => transferTemplates.toMethod2
  )
  transferTemplates2: TransferTemplates[];
}
