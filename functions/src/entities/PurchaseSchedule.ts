import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";
import { Tab } from "./Tab";
import { Method } from "./Method";

@Entity()
export class PurchaseSchedule {
    @PrimaryColumn()
    id: string = "";

    @Column()
    tab_id: string = "";

    @Column()
    user_id: string = "";

    @Column()
    date: number = 1;

    @Column()
    income: boolean = false;

    @Column()
    method: string = "";

    @Column()
    end_date: Date = new Date();

    @Column()
    description: string = "";

    @Column()
    title: string = "";

    @Column()
    cycle: string = "";

    @Column()
    price: number = 0;

    @Column({ nullable: true })
    is_uncertain: boolean | null = null;

    @Column()
    category: string = "";

    @Column()
    day: string = "";

    @Column()
    timestamp: Date = new Date();

    @ManyToOne(() => Account)
    @JoinColumn({ name: "user_id" })
    user: Account;

    @ManyToOne(() => Tab)
    @JoinColumn({ name: "tab_id" })
    tab: Tab;

    @ManyToOne(() => Method)
    @JoinColumn({ name: "method" })
    methodObj: Method;

    constructor() {
        this.id = "";
        this.tab_id = "";
        this.user_id = "";
        this.date = 1;
        this.income = false;
        this.method = "";
        this.end_date = new Date();
        this.description = "";
        this.title = "";
        this.cycle = "";
        this.price = 0;
        this.is_uncertain = null;
        this.category = "";
        this.day = "";
        this.timestamp = new Date();
        this.user = new Account();
        this.tab = new Tab();
        this.methodObj = new Method();
    }
}
