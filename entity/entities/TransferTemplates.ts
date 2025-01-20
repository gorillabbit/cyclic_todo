import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Accounts } from "./Accounts.js";
import { Methods } from "./Methods.js";
import { Tabs } from "./Tabs.js";

@Index("fk_transfer_templates_user", ["userId"], {})
@Index("fk_transfer_templates_tab", ["tabId"], {})
@Index("fk_transfer_templates_from", ["fromMethod"], {})
@Index("fk_transfer_templates_to", ["toMethod"], {})
@Entity("transfer_templates", { schema: "cyclictodo" })
export class TransferTemplates {
  @Column("char", { primary: true, name: "id", length: 20 })
  id!: string;

  @Column("datetime", { name: "date" })
  date!: Date;

  @Column("char", { name: "tab_id", length: 20 })
  tabId!: string;

  @Column("int", { name: "price" })
  price!: number;

  @Column("text", { name: "description" })
  description!: string;

  @Column("char", { name: "from_method", nullable: true, length: 20 })
  fromMethod!: string | null;

  @Column("char", { name: "to_method", nullable: true, length: 20 })
  toMethod!: string | null;

  @Column("char", { name: "user_id", length: 20 })
  userId!: string;

  @Column("datetime", { name: "timestamp" })
  timestamp!: Date;

  @ManyToOne(() => Methods, (methods) => methods.transferTemplates, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "from_method", referencedColumnName: "id" }])
  fromMethod2!: Methods;

  @ManyToOne(() => Tabs, (tabs) => tabs.transferTemplates, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tab_id", referencedColumnName: "id" }])
  tab!: Tabs;

  @ManyToOne(() => Methods, (methods) => methods.transferTemplates2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "to_method", referencedColumnName: "id" }])
  toMethod2!: Methods;

  @ManyToOne(() => Accounts, (accounts) => accounts.transferTemplates, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user!: Accounts;
}