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
import { Logs } from "./Logs.js";
import { LogsCompleteLogs } from "./LogsCompleteLogs.js";
import { Methods } from "./Methods.js";
import { Purchases } from "./Purchases.js";
import { PurchaseSchedules } from "./PurchaseSchedules.js";
import { PurchaseTemplates } from "./PurchaseTemplates.js";
import { Tasks } from "./Tasks.js";
import { TransferTemplates } from "./TransferTemplates.js";

@Index("fk_tabs_user", ["userId"], {})
@Index("fk_tabs_create_user", ["createUserUid"], {})
@Entity("tabs", { schema: "cyclictodo" })
export class Tabs {
  @Column("char", { primary: true, name: "id", length: 20 })
  id!: string;

  @Column("varchar", { name: "name", length: 255 })
  name!: string;

  @Column("char", { name: "create_user_uid", length: 20 })
  createUserUid!: string;

  @Column("json", { name: "shared_accounts" })
  sharedAccounts!: object;

  @Column("varchar", { name: "type", length: 50 })
  type!: string;

  @Column("datetime", { name: "timestamp" })
  timestamp!: Date;

  @Column("char", { name: "user_id", length: 20 })
  userId!: string;

  @OneToMany(() => Assets, (assets) => assets.tab)
  assets!: Assets[];

  @OneToMany(() => Logs, (logs) => logs.tab)
  logs!: Logs[];

  @OneToMany(() => LogsCompleteLogs, (logsCompleteLogs) => logsCompleteLogs.tab)
  logsCompleteLogs!: LogsCompleteLogs[];

  @OneToMany(() => Methods, (methods) => methods.tab)
  methods!: Methods[];

  @OneToMany(
    () => PurchaseSchedules,
    (purchaseSchedules) => purchaseSchedules.tab
  )
  purchaseSchedules!: PurchaseSchedules[];

  @OneToMany(
    () => PurchaseTemplates,
    (purchaseTemplates) => purchaseTemplates.tab
  )
  purchaseTemplates!: PurchaseTemplates[];

  @OneToMany(() => Purchases, (purchases) => purchases.tab)
  purchases!: Purchases[];

  @ManyToOne(() => Accounts, (accounts) => accounts.tabs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "create_user_uid", referencedColumnName: "id" }])
  createUserU!: Accounts;

  @ManyToOne(() => Accounts, (accounts) => accounts.tabs2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user!: Accounts;

  @OneToMany(() => Tasks, (tasks) => tasks.tab)
  tasks!: Tasks[];

  @OneToMany(
    () => TransferTemplates,
    (transferTemplates) => transferTemplates.tab
  )
  transferTemplates!: TransferTemplates[];
}