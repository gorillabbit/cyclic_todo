import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Logs } from "./Logs";
import { Tabs } from "./Tabs";
import { Accounts } from "./Accounts";

@Index("fk_logsCompleteLogs_user", ["userId"], {})
@Index("fk_logsCompleteLogs_log", ["logId"], {})
@Index("fk_logsCompleteLogs_tab", ["tabId"], {})
@Entity("logs_complete_logs", { schema: "cyclictodo" })
export class LogsCompleteLogs {
  @Column("char", { primary: true, name: "id", length: 20 })
  id!: string;

  @Column("tinyint", { name: "processed", nullable: true, width: 1 })
  processed!: boolean | null;

  @Column("text", { name: "memo", nullable: true })
  memo!: string | null;

  @Column("char", { name: "log_id", length: 20 })
  logId!: string;

  @Column("varchar", { name: "type", length: 50 })
  type!: string;

  @Column("datetime", { name: "timestamp" })
  timestamp!: Date;

  @Column("char", { name: "user_id", length: 20 })
  userId!: string;

  @Column("char", { name: "tab_id", length: 20 })
  tabId!: string;

  @ManyToOne(() => Logs, (logs) => logs.logsCompleteLogs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "log_id", referencedColumnName: "id" }])
  log!: Logs;

  @ManyToOne(() => Tabs, (tabs) => tabs.logsCompleteLogs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tab_id", referencedColumnName: "id" }])
  tab!: Tabs;

  @ManyToOne(() => Accounts, (accounts) => accounts.logsCompleteLogs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user!: Accounts;
}