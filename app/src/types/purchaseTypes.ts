import { Timestamp } from 'firebase/firestore';

interface PurchaseBaseType {
    userId: string;
    title: string;
    date: Date; // 商品を買った日
    payDate: Date; // お金を支払った日
    method: string;
    category: string;
    description: string;
    isUncertain?: boolean;
    isGroup?: boolean;
}
const defaultPurchaseBase: PurchaseBaseType = {
    userId: '',
    title: '',
    date: new Date(),
    payDate: new Date(),
    method: '',
    category: '',
    description: '',
    isUncertain: false,
    isGroup: false,
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
    tabId: string;
    assetId: string;
    difference: number;
    balance: number;
    parentScheduleId?: string;
}

export const defaultPurchaseData: PurchaseDataType = {
    ...defaultPurchaseBase,
    difference: 0,
    balance: 0,
    parentScheduleId: '',
    assetId: '',
    id: '',
    tabId: '',
};
export interface PurchaseRawDataType extends Omit<PurchaseDataType, 'date' | 'payDate'> {
    id: string;
    date: Timestamp;
    payDate: Timestamp;
}

export interface TemplateButtonType extends InputFieldPurchaseType {
    id: string;
}
