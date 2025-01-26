import { Column, Entity } from "typeorm";

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

  @Column("char", { name: "user_id", length: 28 })
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
}