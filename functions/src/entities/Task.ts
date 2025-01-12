import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";
import { Tab } from "./Tab";

@Entity()
export class Task {
    @PrimaryColumn()
    id: string = "";

    @Column()
    tab_id: string = "";

    @Column()
    user_id: string = "";

    @Column({ nullable: true })
    is周期的: string | null = null;

    @Column({ nullable: true })
    周期単位: string | null = null;

    @Column({ nullable: true })
    周期日数: number | null = null;

    @Column({ nullable: true })
    due_date: string | null = null;

    @Column({ nullable: true })
    has_due_time: boolean | null = null;

    @Column({ nullable: true })
    icon: string | null = null;

    @Column({ nullable: true })
    description: string | null = null;

    @Column({ nullable: true })
    task_text: string | null = null;

    @Column({ nullable: true })
    due_time: string | null = null;

    @Column({ nullable: true })
    has_due: boolean | null = null;

    @Column({ nullable: true })
    timestamp: Date | null = null;

    @Column({ nullable: true })
    toggle_completion_timestamp: Date | null = null;

    @Column({ nullable: true })
    completed: boolean | null = null;

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
        this.is周期的 = null;
        this.周期単位 = null;
        this.周期日数 = null;
        this.due_date = null;
        this.has_due_time = null;
        this.icon = null;
        this.description = null;
        this.task_text = null;
        this.due_time = null;
        this.has_due = null;
        this.timestamp = null;
        this.toggle_completion_timestamp = null;
        this.completed = null;
        this.user = new Account();
        this.tab = new Tab();
    }
}
