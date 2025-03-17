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
    tabId: string;
    assetId: string;
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
    tabId: '',
    assetId: '',
};

export interface InputFieldPurchaseType extends PurchaseBaseType {
    price: number;
    income: boolean;
    id: string;
}
export const defaultInputFieldPurchase: InputFieldPurchaseType = {
    ...defaultPurchaseBase,
    price: 0,
    income: false,
    id: '',
};
export interface PurchaseDataType extends PurchaseBaseType {
    difference: number;
    balance: number;
    parentScheduleId?: string;
    id: string;
}

export const defaultPurchaseData: PurchaseDataType = {
    ...defaultPurchaseBase,
    difference: 0,
    balance: 0,
    parentScheduleId: '',
    id: '',
};

export interface TemplateButtonType extends InputFieldPurchaseType {
    id: string;
}
