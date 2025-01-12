import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class PurchaseTemplate {
    @PrimaryColumn()
    id: string = "";

    constructor() {
        this.id = "";
        this.date = new Date();
        this.income = false;
        this.tab_id = "";
        this.method = "";
        this.description = "";
        this.title = "";
        this.user_id = "";
        this.price = 0;
        this.is_uncertain = false;
        this.is_group = false;
        this.category = "";
        this.timestamp = new Date();
    }

    @Column()
    date: Date;

    @Column()
    income: boolean;

    @Column()
    tab_id: string;

    @Column()
    method: string;

    @Column()
    description: string;

    @Column()
    title: string;

    @Column()
    user_id: string;

    @Column()
    price: number;

    @Column({ nullable: true })
    is_uncertain: boolean;

    @Column({ nullable: true })
    is_group: boolean;

    @Column()
    category: string;

    @Column()
    timestamp: Date;
}
