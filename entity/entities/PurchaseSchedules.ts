import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Accounts } from "./Accounts.js";
import { Methods } from "./Methods.js";
import { Tabs } from "./Tabs.js";


@Index("fk_purchase_schedules_user", ["userId"], {})
@Index("fk_purchase_schedules_tab", ["tabId"], {})
@Index("fk_purchase_schedules_method", ["method"], {})
@Entity("purchase_schedules", { schema: "cyclictodo" })
export class PurchaseSchedules {
  @Column("char", { primary: true, name: "id", length: 20 })
  id!: string;

  @Column("int", { name: "date" })
  date!: number;

  @Column("tinyint", { name: "income", width: 1 })
  income!: boolean;

  @Column("char", { name: "tab_id", length: 20 })
  tabId!: string;

  @Column("char", { name: "method", length: 20 })
  method!: string;

  @Column("datetime", { name: "end_date" })
  endDate!: Date;

  @Column("text", { name: "description" })
  description!: string;

  @Column("varchar", { name: "title", length: 255 })
  title!: string;

  @Column("char", { name: "user_id", length: 20 })
  userId!: string;

  @Column("varchar", { name: "cycle", length: 50 })
  cycle!: string;

  @Column("int", { name: "price" })
  price!: number;

  @Column("tinyint", { name: "is_uncertain", nullable: true, width: 1 })
  isUncertain!: boolean | null;

  @Column("varchar", { name: "category", length: 100 })
  category!: string;

  @Column("varchar", { name: "day", length: 50 })
  day!: string;

  @Column("datetime", { name: "timestamp" })
  timestamp!: Date;

  @ManyToOne(() => Methods, (methods) => methods.purchaseSchedules, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "method", referencedColumnName: "id" }])
  method2!: Methods;

  @ManyToOne(() => Tabs, (tabs) => tabs.purchaseSchedules, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tab_id", referencedColumnName: "id" }])
  tab!: Tabs;

  @ManyToOne(() => Accounts, (accounts) => accounts.purchaseSchedules, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user!: Accounts;
}