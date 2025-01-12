import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Account {
    @PrimaryColumn()
    id: string = "";

    constructor() {
        this.id = "";
        this.receive_request = null;
        this.linked_accounts = null;
        this.name = "";
        this.icon = "";
        this.send_request = null;
        this.email = "";
        this.use_tab_ids = null;
    }

    @Column({ type: "json", nullable: true })
    receive_request: object | null;

    @Column({ type: "json", nullable: true })
    linked_accounts: object | null;

    @Column()
    name: string = "";

    @Column()
    icon: string = "";

    @Column({ type: "json", nullable: true })
    send_request: object | null;

    @Column()
    email: string = "";

    @Column({ type: "json", nullable: true })
    use_tab_ids: object | null;
}
