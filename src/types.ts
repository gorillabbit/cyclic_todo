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

export interface TaskInputType {
  userId: string;
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

export interface TaskType extends TaskInputType {
  id: string;
}
export interface LogsCompleteLogsInputType {
  logId: string;
  timestamp?: Timestamp;
  type?: string;
  memo: string;
}

export interface LogsCompleteLogsType extends LogsCompleteLogsInputType {
  id: string;
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

export interface AccountInputType {
  uid: string;
  email: string;
  name: string;
  icon: string;
  linkedAccounts: Pick<AccountType, "email" | "name" | "icon">[];
}

export interface AccountType extends AccountInputType {
  id: string;
}

export interface AccountLinkInputType {
  requester: Pick<AccountType, "email" | "name" | "icon">;
  receiver: Pick<AccountType, "email" | "name" | "icon">;
  status: "pending" | "rejected" | "accepted";
}

export interface AccountLinkType extends AccountLinkInputType {
  id: string;
}

export interface InputPurchaseType {
  userId: string;
  title: string;
  price: number;
  date: Date;
  method: MethodListType;
  category: string;
  income: boolean;
  description?: string;
  parentScheduleId?: string;
  childPurchaseId: string;
}

export interface InputPurchaseRowType extends InputPurchaseType {
  id: string;
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
  method: MethodListType;
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

export interface MethodType {
  userId: string;
  label: string;
  assetId: string;
  timing: "即時" | "翌月";
  timingDate?: number;
}

export interface MethodListType extends MethodType {
  id: string;
}

export const defaultMethod: MethodListType = {
  userId: "",
  label: "",
  assetId: "",
  timing: "即時",
  id: "",
};

export const defaultPurchaseInput: InputPurchaseType = {
  userId: "",
  title: "",
  date: new Date(),
  category: "",
  method: defaultMethod,
  price: 0,
  income: false,
  description: "",
  childPurchaseId: "",
};

export const defaultPurchase: PurchaseListType = {
  ...defaultPurchaseInput,
  id: "",
  date: new Timestamp(0, 0),
};
