import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Accounts } from "./Accounts.js";
import { Methods } from "./Methods.js";
import { Purchases } from "./Purchases.js";
import { Tabs } from "./Tabs.js";

@Index("fk_assets_user", ["user_id"], {})
@Index("fk_assets_tab", ["tab_id"], {})
@Entity("assets", { schema: "cyclictodo" })
export class Assets {
  @Column("char", { primary: true, name: "id", length: 20 })
  id!: string;

  @Column("char", { name: "tab_id", length: 20 })
  tab_id!: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name!: string | null;

  @Column("char", { name: "user_id", length: 20 })
  user_id!: string;

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