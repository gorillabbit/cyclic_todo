import { Timestamp } from "firebase/firestore";
import { defaultMethodList, MethodListType } from "../types";

interface PurchaseBaseType {
  userId: string;
  tabId: string;
  title: string;
  date: Date;
  method: MethodListType;
  category: string;
  description: string;
  isUncertain?: boolean;
}
const defaultPurchaseBase: PurchaseBaseType = {
  userId: "",
  tabId: "",
  title: "",
  date: new Date(),
  method: defaultMethodList,
  category: "",
  description: "",
  isUncertain: false,
};

export interface InputFieldPurchaseType extends PurchaseBaseType {
  price: number;
  income: boolean;
}
export const defaultInputFieldPurchase: InputFieldPurchaseType = {
  ...defaultPurchaseBase,
  price: 0,
  income: false,
};
export interface PurchaseDataType extends PurchaseBaseType {
  id: string;
  assetId: string;
  difference: number;
  balance: number;
  parentScheduleId?: string;
  childPurchaseId: string;
}
export const defaultPurchaseData: PurchaseDataType = {
  ...defaultPurchaseBase,
  difference: 0,
  balance: 0,
  parentScheduleId: "",
  childPurchaseId: "",
  assetId: "",
  id: "",
};
export interface PurchaseRawDataType extends Omit<PurchaseDataType, "date"> {
  id: string;
  date: Timestamp;
}

export interface TemplateButtonType extends InputFieldPurchaseType {
  id: string;
}
