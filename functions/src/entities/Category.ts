import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";
import { Tab } from "./Tab";

@Entity()
export class Category {
    @PrimaryColumn()
    id: string = "";

    @Column()
    tab_id: string = "";

    @Column()
    user_id: string = "";

    @Column()
    name: string = "";

    @Column()
    timestamp: Date = new Date();

    @Column({ nullable: true })
    description: string | null = null;

    @Column({ nullable: true })
    color: string | null = null;

    @Column({ nullable: true })
    is_income: boolean | null = null;

    @Column({ nullable: true })
    is_transfer: boolean | null = null;

    @ManyToOne(() => Account)
    @JoinColumn({ name: "user_id" })
    user: Account;

    @ManyToOne(() => Tab)
    @JoinColumn({ name: "tab_id" })
    tab: Tab;

    constructor() {
        this.id = "";
        this.tab_id = "";
        this.user_id = "";
        this.name = "";
        this.timestamp = new Date();
        this.description = null;
        this.color = null;
        this.is_income = null;
        this.is_transfer = null;
        this.user = new Account();
        this.tab = new Tab();
    }
}
