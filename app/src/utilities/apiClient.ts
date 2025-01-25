import {
    AccountType,
    AssetListType,
    MethodListType,
    TabListType,
    TaskType,
    LogType,
    PurchaseScheduleType,
    TransferType,
} from '../types';
import type { PurchaseDataType } from '../types/purchaseTypes';

const baseUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL;

// 汎用GETヘルパー関数
const fetchData = async <T>(
    endpoint: string,
    params: Record<string, string | string[] | undefined>
): Promise<T> => {
    try {
        const urlParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                // 配列の場合、各要素をクエリパラメータとして追加
                value.forEach((v) => {
                    if (v != null && v !== '') {
                        urlParams.append(key, v);
                    }
                });
            } else if (value != null && value !== '') {
                // 配列でない場合、そのまま追加
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

// 汎用データ送信関数
const sendData = async <T>(
    endpoint: string,
    method: 'POST' | 'PUT' | 'DELETE',
    data: T
): Promise<void> => {
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
    } catch (error) {
        console.error(`Error ${method.toLowerCase()}ing data:`, error);
        throw error;
    }
};

// データ作成共通関数
type CreateDataType = PurchaseDataType | MethodListType | AssetListType | TabListType;

export const createData = async <T extends CreateDataType>(
    endpoint: string,
    data: T
): Promise<void> => {
    return sendData(endpoint, 'POST', data);
};

// 購入データ作成（既存コードとの互換性のため保持）
export const createPurchase = async (data: PurchaseDataType): Promise<void> => {
    return createData('/purchase', data);
};

// メソッド作成
export const createMethod = async (data: MethodListType): Promise<void> => {
    return createData('/method', data);
};

// 資産作成
export const createAsset = async (data: AssetListType): Promise<void> => {
    return createData('/asset', data);
};

// タブ作成
export const createTab = async (data: TabListType): Promise<void> => {
    return createData('/tab', data);
};

// データ更新共通関数
export const updateData = async <T extends CreateDataType>(
    endpoint: string,
    id: string,
    data: Partial<T>
): Promise<void> => {
    return sendData(`${endpoint}/${id}`, 'PUT', data);
};

// 購入データ更新（既存コードとの互換性のため保持）
export const updatePurchase = async (
    id: string, data: Partial<PurchaseDataType>
): Promise<void> => {
    return updateData('/purchase', id, data);
};

// メソッド更新
export const updateMethod = async (id: string, data: Partial<MethodListType>): Promise<void> => {
    return updateData('/method', id, data);
};

// 資産更新
export const updateAsset = async (id: string, data: Partial<AssetListType>): Promise<void> => {
    return updateData('/asset', id, data);
};

// タブ更新
export const updateTab = async (id: string, data: Partial<TabListType>): Promise<void> => {
    return updateData('/tab', id, data);
};

export const getPurchases = async (
    tabId?: string
): Promise<PurchaseDataType[]> => {
    console.log(tabId);
    return fetchData<PurchaseDataType[]>('/purchase', {
        tab_id: tabId
    });
};

export const getMethods = async (
    tabId?: string
): Promise<MethodListType[]> => {
    return fetchData<MethodListType[]>('/method', {
        tab_id: tabId
    });
};

export const getAssets = async (
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
export const getTasks = async (
    userId?: string,
    tabId?: string
): Promise<TaskType[]> => {
    return fetchData<TaskType[]>('/task', {
        user_id: userId,
        tab_id: tabId
    });
};

// ログ取得関数
export const getLogs = async (
    userId?: string,
    tabId?: string
): Promise<LogType[]> => {
    return fetchData<LogType[]>('/log', {
        user_id: userId,
        tab_id: tabId
    });
};

// 購入スケジュール取得関数
export const getPurchaseSchedules = async (
    userId?: string,
    tabId?: string
): Promise<PurchaseScheduleType[]> => {
    return fetchData<PurchaseScheduleType[]>('/purchase-schedules', {
        user_id: userId,
        tab_id: tabId
    });
};

// 振替テンプレート取得関数
export const getTransferTemplates = async (
    userId?: string,
    tabId?: string
): Promise<TransferType[]> => {
    return fetchData<TransferType[]>('/transfer-templates', {
        user_id: userId,
        tab_id: tabId
    });
};

// 既存のアカウント取得関数
type FilterParam = {
    // "AccountType" に存在するキーのみ受け付ける (keyof AccountType)
    field: keyof AccountType;
    // 値は文字列か文字列配列を想定（number があるなら number も考慮）
    value: string | string[];
  };
  /**
   * AccountTypeに存在するパラメーター名と値(単一or配列)をまとめてクエリにする
   */
export const getAccounts = async (
    filters: FilterParam[]
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
    filters: FilterParam[]
): Promise<TabListType[]> => {
    const params: Record<string, string | string[]> = {};

    filters.forEach(({ field, value }) => {
        if (Array.isArray(value)) {
            // 配列の場合、同じキーで複数の値を持つ形式にする
            params[field] = value;
        } else {
            params[field] = value;
        }
    });

    console.log(params);

    return fetchData<TabListType[]>('/tab', params);
};