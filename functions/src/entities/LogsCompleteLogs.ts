import { Column, Entity } from 'typeorm';

@Entity('logs_complete_logs', { schema: 'cyclictodo' })
export class LogsCompleteLogs {
  @Column('char', { primary: true, name: 'id', length: 20 })
      id!: string;

  @Column('tinyint', { name: 'processed', nullable: true, width: 1 })
      processed!: boolean | null;

  @Column('text', { name: 'memo', nullable: true })
      memo!: string | null;

  @Column('char', { name: 'log_id', length: 20 })
      logId!: string;

  @Column('varchar', { name: 'type', length: 50 })
      type!: string;

  @Column('datetime', { name: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      timestamp!: Date;

  @Column('char', { name: 'user_id', length: 28 })
      userId!: string;

  @Column('char', { name: 'tab_id', length: 20 })
      tabId!: string;
}