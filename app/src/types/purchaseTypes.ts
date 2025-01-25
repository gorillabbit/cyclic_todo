
interface PurchaseBaseType {
    user_id: string;
    title: string;
    date: Date; // 商品を買った日
    pay_date: Date; // お金を支払った日
    method: string;
    category: string;
    description: string;
    is_uncertain?: boolean;
    is_group?: boolean;
}
const defaultPurchaseBase: PurchaseBaseType = {
    user_id: '',
    title: '',
    date: new Date(),
    pay_date: new Date(),
    method: '',
    category: '',
    description: '',
    is_uncertain: false,
    is_group: false,
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
    tab_id: string;
    asset_id: string;
    difference: number;
    balance: number;
    parent_schedule_id?: string;
}

export const defaultPurchaseData: PurchaseDataType = {
    ...defaultPurchaseBase,
    difference: 0,
    balance: 0,
    parent_schedule_id: '',
    asset_id: '',
    id: '',
    tab_id: '',
};
export interface PurchaseRawDataType extends PurchaseDataType {
    id: string;
}

export interface TemplateButtonType extends InputFieldPurchaseType {
    id: string;
}
