import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Tabs } from "./Tabs";
import { Accounts } from "./Accounts";
import { Methods } from "./Methods";
import { Purchases } from "./Purchases";

@Index("fk_assets_user", ["userId"], {})
@Index("fk_assets_tab", ["tabId"], {})
@Entity("assets", { schema: "cyclictodo" })
export class Assets {
  @Column("char", { primary: true, name: "id", length: 20 })
  id!: string;

  @Column("char", { name: "tab_id", length: 20 })
  tabId!: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Column("char", { name: "user_id", length: 20 })
  userId!: string;

  @Column("datetime", { name: "timestamp", nullable: true })
  timestamp!: Date | null;

  @ManyToOne(() => Tabs, (tabs) => tabs.assets, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tab_id", referencedColumnName: "id" }])
  tab!: Tabs;

  @ManyToOne(() => Accounts, (accounts) => accounts.assets, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user!: Accounts;

  @OneToMany(() => Methods, (methods) => methods.asset)
  methods!: Methods[];

  @OneToMany(() => Purchases, (purchases) => purchases.asset)
  purchases!: Purchases[];
}