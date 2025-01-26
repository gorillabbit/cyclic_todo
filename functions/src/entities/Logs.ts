import { Column, Entity } from 'typeorm';

@Entity('logs', { schema: 'cyclictodo' })
export class Logs {
  @Column('char', { primary: true, name: 'id', length: 20 })
      id!: string;

  @Column('tinyint', { name: 'available_voice_announce', width: 1 })
      availableVoiceAnnounce!: boolean;

  @Column('char', { name: 'tab_id', length: 20 })
      tabId!: string;

  @Column('int', { name: 'interval_num' })
      intervalNum!: number;

  @Column('tinyint', { name: 'available_memo', width: 1 })
      availableMemo!: boolean;

  @Column('varchar', { name: 'voice_announce_unit', length: 20 })
      voiceAnnounceUnit!: string;

  @Column('varchar', { name: 'interval_unit', length: 20 })
      intervalUnit!: string;

  @Column('text', { name: 'icon' })
      icon!: string;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
      description!: string | null;

  @Column('char', { name: 'user_id', length: 28 })
      userId!: string;

  @Column('tinyint', { name: 'duration', width: 1 })
      duration!: boolean;

  @Column('tinyint', {
      name: 'archived',
      nullable: true,
      width: 1,
      default: () => '\'0\'',
  })
      archived!: boolean | null;

  @Column('json', { name: 'accessible_accounts', nullable: true })
      accessibleAccounts!: object | null;

  @Column('int', { name: 'voice_announce_num' })
      voiceAnnounceNum!: number;

  @Column('tinyint', {
      name: 'reviewed',
      nullable: true,
      width: 1,
      default: () => '\'0\'',
  })
      reviewed!: boolean | null;

  @Column('json', { name: 'display_feature', nullable: true })
      displayFeature!: object | null;

  @Column('tinyint', {
      name: 'is_interval',
      nullable: true,
      width: 1,
      default: () => '\'0\'',
  })
      isInterval!: boolean | null;

  @Column('varchar', { name: 'task_text', nullable: true, length: 255 })
      taskText!: string | null;

  @Column('datetime', { name: 'timestamp' })
      timestamp!: Date;
}