import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Methods } from "./Methods";
import { Tabs } from "./Tabs";
import { Accounts } from "./Accounts";

@Index("fk_purchase_templates_user", ["userId"], {})
@Index("fk_purchase_templates_tab", ["tabId"], {})
@Index("fk_purchase_templates_method", ["method"], {})
@Entity("purchase_templates", { schema: "cyclictodo" })
export class PurchaseTemplates {
  @Column("char", { primary: true, name: "id", length: 20 })
  id: string;

  @Column("datetime", { name: "date" })
  date: Date;

  @Column("tinyint", { name: "income", width: 1 })
  income: boolean;

  @Column("char", { name: "tab_id", length: 20 })
  tabId: string;

  @Column("char", { name: "method", length: 20 })
  method: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("char", { name: "user_id", length: 20 })
  userId: string;

  @Column("int", { name: "price" })
  price: number;

  @Column("tinyint", {
    name: "is_uncertain",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isUncertain: boolean | null;

  @Column("tinyint", {
    name: "is_group",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isGroup: boolean | null;

  @Column("varchar", { name: "category", length: 100 })
  category: string;

  @Column("datetime", { name: "timestamp" })
  timestamp: Date;

  @ManyToOne(() => Methods, (methods) => methods.purchaseTemplates, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "method", referencedColumnName: "id" }])
  method2: Methods;

  @ManyToOne(() => Tabs, (tabs) => tabs.purchaseTemplates, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tab_id", referencedColumnName: "id" }])
  tab: Tabs;

  @ManyToOne(() => Accounts, (accounts) => accounts.purchaseTemplates, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Accounts;
}
