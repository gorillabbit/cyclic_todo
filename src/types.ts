import { Timestamp } from "firebase/firestore";

// 曜日を表す型を定義
export type WeekDay =
  | "日曜日"
  | "月曜日"
  | "火曜日"
  | "水曜日"
  | "木曜日"
  | "金曜日"
  | "土曜日";

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

export interface InputLogType {
  userId: string;
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

export interface LogType extends InputLogType {
  id: string;
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

export interface InputPurchaseType {
  userId: string;
  title: string;
  price: number;
  date: Date;
  method: string;
  category: string;
  income: boolean;
  description?: string;
  parentScheduleId?: string;
}

export interface PurchaseType extends Omit<InputPurchaseType, "date"> {
  date: Timestamp;
}

export interface PurchaseListType extends PurchaseType {
  id: string;
}

export interface AssetType {
  userId: string;
  name: string;
  balance: number;
}

export interface AssetListType extends AssetType {
  id: string;
}

export interface InputPurchaseScheduleType {
  userId: string;
  title: string;
  price: number;
  date?: number;
  day?: WeekDay;
  cycle: string;
  method: string;
  category: string;
  income: boolean;
  description?: string;
  endDate: Date;
}

export interface PurchaseScheduleType
  extends Omit<InputPurchaseScheduleType, "endDate"> {
  endDate: Timestamp;
}

export interface PurchaseScheduleListType extends PurchaseScheduleType {
  id: string;
}
