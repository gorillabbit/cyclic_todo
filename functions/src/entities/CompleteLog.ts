import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";
import { Log } from "./Log";
import { Tab } from "./Tab";

@Entity("logs_complete_logs")
export class CompleteLog {
    @PrimaryColumn()
    id: string = "";

    @Column({ nullable: true })
    processed: boolean | null = null;

    @Column({ nullable: true })
    memo: string | null = null;

    @Column()
    log_id: string = "";

    @Column()
    type: string = "";

    @Column()
    timestamp: Date = new Date();

    @Column()
    user_id: string = "";

    @Column()
    tab_id: string = "";

    @ManyToOne(() => Account)
    @JoinColumn({ name: "user_id" })
    user: Account;

    @ManyToOne(() => Log)
    @JoinColumn({ name: "log_id" })
    log: Log;

    @ManyToOne(() => Tab)
    @JoinColumn({ name: "tab_id" })
    tab: Tab;

    constructor() {
        this.id = "";
        this.processed = null;
        this.memo = null;
        this.log_id = "";
        this.type = "";
        this.timestamp = new Date();
        this.user_id = "";
        this.tab_id = "";
        this.user = new Account();
        this.log = new Log();
        this.tab = new Tab();
    }
}
