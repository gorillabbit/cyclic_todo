import { Column, Entity, OneToMany } from "typeorm";
import { Assets } from "./Assets";
import { Logs } from "./Logs";
import { LogsCompleteLogs } from "./LogsCompleteLogs";
import { Methods } from "./Methods";
import { PurchaseSchedules } from "./PurchaseSchedules";
import { PurchaseTemplates } from "./PurchaseTemplates";
import { Purchases } from "./Purchases";
import { Tabs } from "./Tabs";
import { Tasks } from "./Tasks";
import { TransferTemplates } from "./TransferTemplates";

@Entity("accounts", { schema: "cyclictodo" })
export class Accounts {
  @Column("char", { primary: true, name: "id", length: 20 })
  id!: string;

  @Column("json", { name: "receive_request", nullable: true })
  receiveRequest!: object | null;

  @Column("json", { name: "linked_accounts", nullable: true })
  linkedAccounts!: object | null;

  @Column("varchar", { name: "name", length: 255 })
  name!: string;

  @Column("text", { name: "icon" })
  icon!: string;

  @Column("json", { name: "send_request", nullable: true })
  sendRequest!: object | null;

  @Column("varchar", { name: "email", length: 255 })
  email!: string;

  @Column("json", { name: "use_tab_ids", nullable: true })
  useTabIds!: object | null;

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