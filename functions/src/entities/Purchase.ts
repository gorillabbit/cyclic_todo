import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";
import { Tab } from "./Tab";
import { Method } from "./Method";
import { Asset } from "./Asset";

@Entity()
export class Purchase {
    @PrimaryColumn()
    id: string = "";

    @Column()
    tab_id: string = "";

    @Column()
    user_id: string = "";

    @Column()
    date: Date = new Date();

    @Column({ nullable: true })
    income: boolean | null = false;

    @Column()
    method: string = "";

    @Column({ default: 0 })
    price: number = 0;

    @Column()
    description: string = "";

    @Column()
    title: string = "";

    @Column({ nullable: true })
    category: string | null = null;

    @Column({ nullable: true })
    child_purchase_id: string | null = null;

    @Column({ nullable: true })
    difference: number | null = null;

    @Column()
    asset_id: string = "";

    @Column({ nullable: true })
    pay_date: Date | null = null;

    @Column({ nullable: true })
    balance: number | null = null;

    @Column({ nullable: true })
    timestamp: Date | null = new Date();

    @ManyToOne(() => Account)
    @JoinColumn({ name: "user_id" })
    user: Account;

    @ManyToOne(() => Tab)
    @JoinColumn({ name: "tab_id" })
    tab: Tab;

    @ManyToOne(() => Method)
    @JoinColumn({ name: "method" })
    methodObj: Method;

    @ManyToOne(() => Asset)
    @JoinColumn({ name: "asset_id" })
    asset: Asset;

    constructor() {
        this.id = "";
        this.tab_id = "";
        this.user_id = "";
        this.date = new Date();
        this.income = false;
        this.method = "";
        this.price = 0;
        this.description = "";
        this.title = "";
        this.category = null;
        this.child_purchase_id = null;
        this.difference = null;
        this.asset_id = "";
        this.pay_date = null;
        this.balance = null;
        this.timestamp = new Date();
        this.user = new Account();
        this.tab = new Tab();
        this.methodObj = new Method();
        this.asset = new Asset();
    }
}
