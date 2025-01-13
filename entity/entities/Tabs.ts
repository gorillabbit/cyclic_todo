import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Assets } from "./Assets";
import { Logs } from "./Logs";
import { LogsCompleteLogs } from "./LogsCompleteLogs";
import { Methods } from "./Methods";
import { PurchaseSchedules } from "./PurchaseSchedules";
import { PurchaseTemplates } from "./PurchaseTemplates";
import { Purchases } from "./Purchases";
import { Accounts } from "./Accounts";
import { Tasks } from "./Tasks";
import { TransferTemplates } from "./TransferTemplates";

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