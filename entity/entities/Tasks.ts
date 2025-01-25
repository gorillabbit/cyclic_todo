import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Accounts } from "./Accounts.js";
import { Tabs } from "./Tabs.js";

@Index("fk_tasks_user", ["user_id",], {})
@Index("fk_tasks_tab", ["tab_id",], {})
@Entity("tasks", { schema: "cyclictodo" })
export class Tasks {

    @Column("char", { primary: true, name: "id", length: 20 })
    id!: string;

    @Column("varchar", { name: "is周期的", nullable: true, length: 50 })
    is周期的!: string | null;

    @Column("varchar", { name: "周期単位", nullable: true, length: 50 })
    周期単位!: string | null;

    @Column("int", { name: "周期日数", nullable: true })
    周期日数!: number | null;

    @Column("varchar", { name: "due_date", nullable: true, length: 20 })
    due_date!: string | null;

    @Column("tinyint", { name: "has_due_time", nullable: true, width: 1 })
    has_due_time!: boolean | null;

    @Column("text", { name: "icon", nullable: true })
    icon!: string | null;

    @Column("text", { name: "description", nullable: true })
    description!: string | null;

    @Column("varchar", { name: "task_text", nullable: true, length: 255 })
    taskText!: string | null;

    @Column("varchar", { name: "due_time", nullable: true, length: 50 })
    dueTime!: string | null;

    @Column("char", { name: "user_id", length: 20 })
    user_id!: string;

    @Column("tinyint", { name: "has_due", nullable: true, width: 1 })
    has_due!: boolean | null;

    @Column("datetime", { name: "timestamp", nullable: true })
    timestamp!: Date | null;

    @Column("datetime", { name: "toggle_completion_timestamp", nullable: true })
    toggle_completion_timestamp!: Date | null;

    @Column("tinyint", { name: "completed", nullable: true, width: 1 })
    completed!: boolean | null;

    @Column("char", { name: "tab_id", length: 20 })
    tab_id!: string;

    @ManyToOne(() => Tabs, tabs => tabs.tasks, { onDelete: "NO ACTION", onUpdate: "NO ACTION" })
    @JoinColumn([{ name: "tab_id", referencedColumnName: "id" },
    ])

    tab!: Tabs;

    @ManyToOne(() => Accounts, accounts => accounts.tasks, { onDelete: "NO ACTION", onUpdate: "NO ACTION" })
    @JoinColumn([{ name: "user_id", referencedColumnName: "id" },
    ])

    user!: Accounts;

}