import { AccountType, AssetListType, MethodListType } from '../types';
import { PurchaseDataType } from '../types/purchaseTypes';

const baseUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL;

// GET関数
export const getPurchases = async (
    userId?: string, tabId?: string): Promise<PurchaseDataType[]> => {
    try {
        const params = new URLSearchParams();
        if (userId != null && userId !== '') params.append('user_id', userId);
        if (tabId != null && tabId !== '') params.append('tab_id', tabId);

        const response = await fetch(`${baseUrl}/purchase?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching purchases:', error);
        throw error;
    }
};

// PUT関数
export const createPurchase = async (data: PurchaseDataType): Promise<void> => {
    try {
        const response = await fetch(`${baseUrl}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating purchase:', error);
        throw error;
    }
};

export const getMethods = async (
    tabId?: string): Promise<MethodListType[]> => {
    try {
        const params = new URLSearchParams();
        if (tabId != null && tabId !== '') params.append('tab_id', tabId);

        const response = await fetch(`${baseUrl}/method?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching purchases:', error);
        throw error;
    }
};

export const getAssets = async (
    tabId?: string): Promise<AssetListType[]> => {
    try {
        const params = new URLSearchParams();
        if (tabId != null && tabId !== '') params.append('tab_id', tabId);

        const response = await fetch(`${baseUrl}/asset?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching purchases:', error);
        throw error;
    }
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
    try {
        const params = new URLSearchParams();
  
        filters.forEach(({ field, value }) => {
            if (Array.isArray(value)) {
                // 配列なら、その要素それぞれを同じキーで追加
                // e.g. ?id=id1&id=id2&id=id3
                value.forEach((v) => params.append(field, v));
            } else {
                // 単一値なら set でOK (重複したキーは上書きになるので注意)
                // もし複数同じキーを追加したい場合は append にする
                params.set(field, value);
            }
        });
  
        // 生成したクエリを付与して fetch
        const response = await fetch(`${baseUrl}/account?${params.toString()}`, {
            method: 'GET',
        });
  
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        // JSON をパースして返す
        const accounts: AccountType[] = await response.json();
        return accounts;
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw error;
    }
};
