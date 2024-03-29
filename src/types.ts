import { Timestamp } from "firebase/firestore";

export interface TaskType {
  userId: string;
  id?: string;
  text: string;
  hasDue: boolean;
  dueDate: string | Date;
  hasDueTime: boolean;
  dueTime: string | Date;
  completed: boolean;
  is周期的: string;
  周期日数: string;
  周期単位: string;
  親taskId?: string;
  toggleCompletionTimestamp?: Timestamp;
  icon: string;
  description: string;
}
export interface LogsCompleteLogsType {
  id?: string;
  logId: string;
  timestamp?: Timestamp;
  type?: string;
  memo: string;
}

export interface LogType {
  userId: string;
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
  displayFeature: string[];
  description: string;
  archived: boolean;
  accessibleAccounts: Pick<AccountType, "email" | "name" | "icon">[];
  accessibleAccountsEmails: string[];
}

export interface AccountType {
  uid: string;
  id?: string;
  email: string;
  name: string;
  icon: string;
  linkedAccounts: Pick<AccountType, "email" | "name" | "icon">[];
}

export interface AccountLinkType {
  id?: string;
  requester: Pick<AccountType, "email" | "name" | "icon">;
  receiver: Pick<AccountType, "email" | "name" | "icon">;
  status: "pending" | "rejected" | "accepted";
}
