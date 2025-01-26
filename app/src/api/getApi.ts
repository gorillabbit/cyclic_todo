import { LogType } from 'vite';
import { 
    MethodListType, 
    AssetListType, 
    AccountType, 
    TaskType, 
    PurchaseScheduleType, 
    TransferType, 
    TabListType 
} from '../types';
import { PurchaseDataType } from '../types/purchaseTypes';
import { fetchData } from './apiClient';

export const getMethod = async (
    tabId?: string
): Promise<MethodListType[]> => {
    return fetchData<MethodListType[]>('/method', {
        tab_id: tabId
    });
};

export const getAsset = async (
    tabId?: string
): Promise<AssetListType[]> => {
    return fetchData<AssetListType[]>('/asset', {
        tab_id: tabId
    });
};

// アカウント詳細取得関数
export const getAccountDetails = async (
    accountId: string
): Promise<AccountType> => {
    return fetchData<AccountType>(`/account/${accountId}`, {});
};


// タスク取得関数
export const getTask = async (
    userId?: string,
    tabId?: string
): Promise<TaskType[]> => {
    return fetchData<TaskType[]>('/task', {
        user_id: userId,
        tab_id: tabId
    });
};

// ログ取得関数
export const getLog = async (
    userId?: string,
    tabId?: string
): Promise<LogType[]> => {
    return fetchData<LogType[]>('/log', {
        user_id: userId,
        tab_id: tabId
    });
};

// 購入スケジュール取得関数
export const getPurchaseSchedule = async (
    userId?: string,
    tabId?: string
): Promise<PurchaseScheduleType[]> => {
    return fetchData<PurchaseScheduleType[]>('/purchase-schedules', {
        user_id: userId,
        tab_id: tabId
    });
};

// 購入スケジュール取得関数
export const getPurchaseTemplate = async (
    userId?: string,
    tabId?: string
): Promise<PurchaseScheduleType[]> => {
    return fetchData<PurchaseScheduleType[]>('/purchase-template', {
        user_id: userId,
        tab_id: tabId
    });
};


// 振替テンプレート取得関数
export const getTransferTemplate = async (
    userId?: string,
    tabId?: string
): Promise<TransferType[]> => {
    return fetchData<TransferType[]>('/transfer-template', {
        user_id: userId,
        tab_id: tabId
    });
};

// 既存のアカウント取得関数
type FilterParam<T extends object> = {
    field: keyof T;
    value: string | string[];
  };

export const getAccount = async (
    filters: FilterParam<AccountType>[]
): Promise<AccountType[]> => {
    const params: Record<string, string> = {};
    
    filters.forEach(({ field, value }) => {
        if (Array.isArray(value)) {
            value.forEach((v, index) => params[`${field}[${index}]`] = v);
        } else {
            params[field] = value;
        }
    });

    return fetchData<AccountType[]>('/account', params);
};

export const getTab = async (
    filters: FilterParam<TabListType>[]
): Promise<TabListType[]> => {
    const params: Record<string, string | string[]> = {};

    filters.forEach(({ field, value }) => {
        if (Array.isArray(value)) {
            params[field] = value;
        } else {
            params[field] = value;
        }
    });

    console.log(params);

    return fetchData<TabListType[]>('/tab', params);
};

export const getPurchase = async (
    filters: FilterParam<PurchaseDataType>[]
): Promise<PurchaseDataType[]> => {
    const params: Record<string, string | string[]> = {};

    filters.forEach(({ field, value }) => {
        if (Array.isArray(value)) {
            params[field] = value;
        } else {
            params[field] = value;
        }
    });

    console.log(params);

    return fetchData<PurchaseDataType[]>('/purchase', params);
};