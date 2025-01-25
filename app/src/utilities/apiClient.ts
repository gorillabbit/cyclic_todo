import {
    AccountType,
    AssetListType,
    MethodListType,
    TabListType,
    TaskType,
    LogType,
    PurchaseScheduleType,
    TransferType,
    InputPurchaseScheduleType,
} from '../types';
import type { PurchaseDataType } from '../types/purchaseTypes';

const baseUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL;

type WithId<T> = T & {
    id: string;
  };

// 汎用データ送信関数
const sendData = async <T>(
    endpoint: string,
    method: 'POST' | 'PUT' | 'DELETE',
    data: T
): Promise<WithId<T>> => {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error ${method.toLowerCase()}ing data:`, error);
        throw error;
    }
};

// データ作成共通関数
export const createData = async <T>(
    endpoint: string,
    data: T
): Promise<WithId<T>> => {
    return sendData(endpoint, 'POST', data);
};

// 購入データ作成（既存コードとの互換性のため保持）
export const createPurchase = async (data: PurchaseDataType): Promise<PurchaseDataType> => {
    return createData('/purchase', data);
};

export const createPurchaseSchedule = async (
    data: InputPurchaseScheduleType
): Promise<PurchaseScheduleType> => {
    return createData('/purchase-schedule', data);
};

// メソッド作成
export const createMethod = async (data: MethodListType): Promise<MethodListType> => {
    return createData('/method', data);
};

// 資産作成
export const createAsset = async (data: AssetListType): Promise<AssetListType> => {
    return createData('/asset', data);
};

// タブ作成
export const createTab = async (data: TabListType): Promise<TabListType> => {
    return createData('/tab', data);
};

// データ更新共通関数
export const updateData = async <T>(
    endpoint: string,
    id: string,
    data: Partial<T>
): Promise<Partial<T>> => {
    return sendData(`${endpoint}/${id}`, 'PUT', data);
};

// 購入データ更新（既存コードとの互換性のため保持）
export const updatePurchase = async (
    id: string, data: Partial<PurchaseDataType>
):Promise<Partial<PurchaseDataType>> => {
    return updateData('/purchase', id, data);
};

export const updatePurchaseSchedule = async (
    id: string, data: Partial<InputPurchaseScheduleType>
):Promise<Partial<PurchaseScheduleType>> => {
    return updateData('/purchase-schedule', id, data);
};

// メソッド更新
export const updateMethod = async (
    id: string, data: Partial<MethodListType>
): Promise<Partial<MethodListType>> => {
    return updateData('/method', id, data);
};

// 資産更新
export const updateAsset = async (
    id: string, data: Partial<AssetListType>
): Promise<Partial<AssetListType>> => {
    return updateData('/asset', id, data);
};

// タブ更新
export const updateTab = async (
    id: string, data: Partial<TabListType>
): Promise<Partial<TabListType>> => {
    return updateData('/tab', id, data);
};

// データ削除共通関数
export const deleteData = async (
    endpoint: string,
    id: string
): Promise<{}> => {
    return sendData(`${endpoint}/${id}`, 'DELETE', {});
};

// 購入データ削除
export const deletePurchase = async (id: string): Promise<{}> => {
    return deleteData('/purchase', id);
};

export const deleteAsset = async (id: string): Promise<{}> => {
    return deleteData('/asset', id);
};

export const deleteMethod = async (id: string): Promise<{}> => {
    return deleteData('/method', id);
};

// 汎用GETヘルパー関数
const fetchData = async <T>(
    endpoint: string,
    params: Record<string, string | string[] | undefined>
): Promise<T> => {
    try {
        const urlParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    if (v != null && v !== '') {
                        urlParams.append(key, v);
                    }
                });
            } else if (value != null && value !== '') {
                urlParams.append(key, value);
            }
        });

        const response = await fetch(`${baseUrl}${endpoint}?${urlParams.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const getMethods = async (
    tab_id?: string
): Promise<MethodListType[]> => {
    return fetchData<MethodListType[]>('/method', {
        tab_id: tab_id
    });
};

export const getAssets = async (
    tab_id?: string
): Promise<AssetListType[]> => {
    return fetchData<AssetListType[]>('/asset', {
        tab_id: tab_id
    });
};

// アカウント詳細取得関数
export const getAccountDetails = async (
    accountId: string
): Promise<AccountType> => {
    return fetchData<AccountType>(`/account/${accountId}`, {});
};


// タスク取得関数
export const getTasks = async (
    user_id?: string,
    tab_id?: string
): Promise<TaskType[]> => {
    return fetchData<TaskType[]>('/task', {
        user_id: user_id,
        tab_id: tab_id
    });
};

// ログ取得関数
export const getLogs = async (
    user_id?: string,
    tab_id?: string
): Promise<LogType[]> => {
    return fetchData<LogType[]>('/log', {
        user_id: user_id,
        tab_id: tab_id
    });
};

// 購入スケジュール取得関数
export const getPurchaseSchedules = async (
    user_id?: string,
    tab_id?: string
): Promise<PurchaseScheduleType[]> => {
    return fetchData<PurchaseScheduleType[]>('/purchase-schedules', {
        user_id: user_id,
        tab_id: tab_id
    });
};

// 振替テンプレート取得関数
export const getTransferTemplates = async (
    user_id?: string,
    tab_id?: string
): Promise<TransferType[]> => {
    return fetchData<TransferType[]>('/transfer-templates', {
        user_id: user_id,
        tab_id: tab_id
    });
};

// 既存のアカウント取得関数
type FilterParam<T extends object> = {
    field: keyof T;
    value: string | string[];
  };

export const getAccounts = async (
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

export const getTabs = async (
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

export const getPurchases = async (
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