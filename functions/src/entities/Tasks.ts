import { Column,Entity } from 'typeorm';


@Entity('tasks' ,{ schema:'cyclictodo' } )
export  class Tasks {

@Column('char',{ primary:true,name:'id',length:20 })
    id!: string;

@Column('varchar',{ name:'is_cyclic',nullable:true,length:50 })
    isCyclic!: string | null;

@Column('varchar',{ name:'cyclic_unit',nullable:true,length:50 })
    cyclicUnit!: string | null;

@Column('int',{ name:'cyclic_count',nullable:true })
    cyclicCount!: number | null;

@Column('varchar',{ name:'due_date',nullable:true,length:20 })
    dueDate!: string | null;

@Column('tinyint',{ name:'has_due_time',nullable:true,width:1 })
    hasDueTime!: boolean | null;

@Column('text',{ name:'icon',nullable:true })
    icon!: string | null;

@Column('text',{ name:'description',nullable:true })
    description!: string | null;

@Column('varchar',{ name:'task_text',nullable:true,length:255 })
    taskText!: string | null;

@Column('varchar',{ name:'due_time',nullable:true,length:50 })
    dueTime!: string | null;

@Column('char',{ name:'user_id',length:28 })
    userId!: string;

@Column('tinyint',{ name:'has_due',nullable:true,width:1 })
    hasDue!: boolean | null;

@Column('datetime',{ name:'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp!: Date;

@Column('datetime',{ name:'toggle_completion_timestamp',nullable:true })
    toggleCompletionTimestamp!: Date | null;

@Column('tinyint',{ name:'completed',nullable:true,width:1 })
    completed!: boolean | null;

@Column('char',{ name:'tab_id',length:20 })
    tabId!: string;

}