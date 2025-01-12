import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";

@Entity()
export class Tab {
    @PrimaryColumn()
    id: string = "";

    @Column()
    name: string = "";

    @Column()
    create_user_uid: string = "";

    @Column({ type: "json" })
    shared_accounts: object;

    @Column()
    type: string = "";

    @Column()
    timestamp: Date = new Date();

    @Column()
    user_id: string = "";

    @ManyToOne(() => Account)
    @JoinColumn({ name: "user_id" })
    user: Account;

    @ManyToOne(() => Account)
    @JoinColumn({ name: "create_user_uid" })
    createUser: Account;

    constructor() {
        this.id = "";
        this.name = "";
        this.create_user_uid = "";
        this.shared_accounts = {};
        this.type = "";
        this.timestamp = new Date();
        this.user_id = "";
        this.user = new Account();
        this.createUser = new Account();
    }
}
