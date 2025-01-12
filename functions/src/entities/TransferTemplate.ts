import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class TransferTemplate {
    @PrimaryColumn()
    id: string = "";

    constructor() {
        this.id = "";
        this.date = new Date();
        this.tab_id = "";
        this.price = 0;
        this.description = "";
        this.from_method = null;
        this.to_method = null;
        this.user_id = "";
        this.timestamp = new Date();
    }

    @Column()
    date: Date;

    @Column()
    tab_id: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column({ nullable: true })
    from_method: string | null;

    @Column({ nullable: true })
    to_method: string | null;

    @Column()
    user_id: string;

    @Column()
    timestamp: Date;
}
