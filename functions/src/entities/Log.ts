import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";
import { Tab } from "./Tab";

@Entity()
export class Log {
    @PrimaryColumn()
    id: string = "";

    @Column()
    tab_id: string = "";

    @Column()
    user_id: string = "";

    @Column()
    available_voice_announce: boolean = false;

    @Column()
    interval_num: number = 0;

    @Column()
    available_memo: boolean = false;

    @Column()
    voice_announce_unit: string = "";

    @Column()
    interval_unit: string = "";

    @Column()
    icon: string = "";

    @Column({ nullable: true })
    description: string | null = null;

    @Column()
    duration: boolean = false;

    @Column({ nullable: true })
    archived: boolean | null = null;

    @Column({ type: "json", nullable: true })
    accessible_accounts: object | null = null;

    @Column()
    voice_announce_num: number = 0;

    @Column({ nullable: true })
    reviewed: boolean | null = null;

    @Column({ type: "json", nullable: true })
    display_feature: object | null = null;

    @Column({ nullable: true })
    is_interval: boolean | null = null;

    @Column({ nullable: true })
    task_text: string | null = null;

    @Column()
    timestamp: Date = new Date();

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
        this.available_voice_announce = false;
        this.interval_num = 0;
        this.available_memo = false;
        this.voice_announce_unit = "";
        this.interval_unit = "";
        this.icon = "";
        this.description = null;
        this.duration = false;
        this.archived = null;
        this.accessible_accounts = null;
        this.voice_announce_num = 0;
        this.reviewed = null;
        this.display_feature = null;
        this.is_interval = null;
        this.task_text = null;
        this.timestamp = new Date();
        this.user = new Account();
        this.tab = new Tab();
    }
}
