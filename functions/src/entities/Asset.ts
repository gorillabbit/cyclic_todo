import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";
import { Tab } from "./Tab";

@Entity()
export class Asset {
    @PrimaryColumn()
    id: string = "";

    @Column()
    tab_id: string = "";

    @Column()
    user_id: string = "";

    @Column({ nullable: true })
    name: string | null = null;

    @Column({ nullable: true })
    timestamp: Date | null = new Date();

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
        this.name = null;
        this.timestamp = new Date();
        this.user = new Account();
        this.tab = new Tab();
    }
}
