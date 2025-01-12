import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";
import { Tab } from "./Tab";
import { Asset } from "./Asset";

@Entity()
export class Method {
    @PrimaryColumn()
    id: string = "";

    @Column()
    tab_id: string = "";

    @Column()
    user_id: string = "";

    @Column()
    timing_date: number = 1;

    @Column()
    asset_id: string = "";

    @Column()
    timing: string = "";

    @Column()
    label: string = "";

    @Column({ nullable: true })
    timestamp: Date | null = new Date();

    @ManyToOne(() => Asset)
    @JoinColumn({ name: "asset_id" })
    asset: Asset;

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
        this.timing_date = 1;
        this.asset_id = "";
        this.timing = "";
        this.label = "";
        this.timestamp = new Date();
        this.user = new Account();
        this.tab = new Tab();
        this.asset = new Asset();
    }
}
