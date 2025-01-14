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

export interface MethodType {
  userId: string;
  label: string;
  assetId: string;
  timing: "即時" | "翌月";
  timingDate: number;
  tabId: string;
}

export const defaultMethod: MethodType = {
  userId: "",
  label: "",
  assetId: "",
  timing: "即時",
  timingDate: 0,
  tabId: "",
};

export interface MethodListType extends MethodType {
  id: string;
}
export const defaultMethodList: MethodListType = {
  ...defaultMethod,
  id: "",
};

export interface InputPurchaseType {
  userId: string;
  title: string;
  price: number;
  date: Date;
  method: MethodListType;
  category: string;
  income: boolean;
  description: string;
  parentScheduleId?: string;
  childPurchaseId: string;
  isUncertain?: boolean;
  tabId: string;
}
export const defaultPurchaseInput: InputPurchaseType = {
  userId: "",
  title: "",
  date: new Date(),
  category: "",
  method: defaultMethodList,
  price: 0,
  income: false,
  description: "",
  childPurchaseId: "",
  tabId: "",
};
export interface InputPurchaseRowType extends InputPurchaseType {
  id: string;
}
export interface PurchaseType extends Omit<InputPurchaseType, "date"> {
  date: Timestamp;
}
export interface PurchaseListType extends PurchaseType {
  id: string;
}
export const defaultPurchase: PurchaseListType = {
  ...defaultPurchaseInput,
  id: "",
  date: new Timestamp(0, 0),
};

export interface InputBalanceLog {
  timestamp: Date;
  balance: number;
}
export interface BalanceLog {
  timestamp: Timestamp;
  balance: number;
}

export interface InputAssetType {
  userId: string;
  name: string;
  balanceLog: InputBalanceLog[];
  tabId: string;
}
export interface AssetType extends Omit<InputAssetType, "balanceLog"> {
  balanceLog: BalanceLog[];
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
  description: string;
  endDate: Date;
  isUncertain: boolean;
  tabId: string;
}
export interface InputPurchaseScheduleRowType
  extends InputPurchaseScheduleType {
  id: string;
}
export interface PurchaseScheduleType
  extends Omit<InputPurchaseScheduleType, "endDate"> {
  endDate: Timestamp;
}
export interface PurchaseScheduleListType extends PurchaseScheduleType {
  id: string;
}

export interface InputAccountType {
  userId: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  tabId: string;
}

export interface AccountType extends Omit<InputAccountType, 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AccountListType extends AccountType {
  id: string;
}

export const defaultAccount: AccountListType = {
  userId: '',
  name: '',
  email: '',
  createdAt: new Timestamp(0, 0),
  updatedAt: new Timestamp(0, 0),
  tabId: '',
  id: ''
};

export interface InputTabType {
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TabType extends Omit<InputTabType, 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TabListType extends TabType {
  id: string;
}

export const defaultTab: TabListType = {
  userId: '',
  name: '',
  createdAt: new Timestamp(0, 0),
  updatedAt: new Timestamp(0, 0),
  id: ''
};
