import { Timestamp } from "firebase/firestore";

export interface TaskType {
  id?: string;
  text: string;
  期日: string | Date;
  時刻: string | Date;
  completed: boolean;
  is周期的: string;
  周期日数?: string;
  周期単位?: string;
  親taskId?: string;
  toggleCompletionTimestamp?: Timestamp;
  icon?: string;
}
export interface LogsCompleteLogsType {
  id?: string;
  logId: string;
  timestamp?: Timestamp;
  type?: string;
  memo: string;
}

export interface LogType {
  id?: string;
  text: string;
  親logId?: string;
  timestamp?: Timestamp;
  completeLogs?: LogsCompleteLogsType[];
  duration: boolean;
  interval: boolean;
  intervalNum: number;
  intervalUnit: string;
  availableMemo: boolean;
  availableVoiceAnnounce: boolean;
  voiceAnnounceNum?: number;
  voiceAnnounceUnit?: string;
  icon?: string;
}
