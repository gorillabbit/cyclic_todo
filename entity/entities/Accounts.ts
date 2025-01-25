import { Column, Entity, OneToMany } from "typeorm";
import { Assets } from "./Assets.js";
import { Logs } from "./Logs.js";
import { LogsCompleteLogs } from "./LogsCompleteLogs.js";
import { Methods } from "./Methods.js";
import { Purchases } from "./Purchases.js";
import { PurchaseSchedules } from "./PurchaseSchedules.js";
import { PurchaseTemplates } from "./PurchaseTemplates.js";
import { Tabs } from "./Tabs.js";
import { Tasks } from "./Tasks.js";
import { TransferTemplates } from "./TransferTemplates.js";


@Entity("accounts", { schema: "cyclictodo" })
export class Accounts {
  @Column("char", { primary: true, name: "id", length: 20 })
  id!: string;

  @Column("json", { name: "receive_request", nullable: true })
  receive_request!: object | null;

  @Column("json", { name: "linked_accounts", nullable: true })
  linked_accounts!: object | null;

  @Column("varchar", { name: "name", length: 255 })
  name!: string;

  @Column("text", { name: "icon" })
  icon!: string;

  @Column("json", { name: "send_request", nullable: true })
  send_request!: object | null;

  @Column("varchar", { name: "email", length: 255 })
  email!: string;

  @Column("json", { name: "use_tab_ids", nullable: true })
  use_tab_ids!: object | null;

  @OneToMany(() => Assets, (assets) => assets.user)
  assets!: Assets[];

  @OneToMany(() => Logs, (logs) => logs.user)
  logs!: Logs[];

  @OneToMany(
    () => LogsCompleteLogs,
    (logsCompleteLogs) => logsCompleteLogs.user
  )
  logsCompleteLogs!: LogsCompleteLogs[];

  @OneToMany(() => Methods, (methods) => methods.user)
  methods!: Methods[];

  @OneToMany(
    () => PurchaseSchedules,
    (purchaseSchedules) => purchaseSchedules.user
  )
  purchaseSchedules!: PurchaseSchedules[];

  @OneToMany(
    () => PurchaseTemplates,
    (purchaseTemplates) => purchaseTemplates.user
  )
  purchaseTemplates!: PurchaseTemplates[];

  @OneToMany(() => Purchases, (purchases) => purchases.user)
  purchases!: Purchases[];

  @OneToMany(() => Tabs, (tabs) => tabs.createUserU)
  tabs!: Tabs[];

  @OneToMany(() => Tabs, (tabs) => tabs.user)
  tabs2!: Tabs[];

  @OneToMany(() => Tasks, (tasks) => tasks.user)
  tasks!: Tasks[];

  @OneToMany(
    () => TransferTemplates,
    (transferTemplates) => transferTemplates.user
  )
  transferTemplates!: TransferTemplates[];
}