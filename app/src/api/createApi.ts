import { 
    InputPurchaseScheduleType, PurchaseScheduleType, MethodListType, AssetListType, TabListType, 
} from '../types';
import { PurchaseDataType } from '../types/purchaseTypes';
import { sendData, WithId } from './apiClient';

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
export const createMethod = async (data:MethodListType ): Promise<MethodListType> => {
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
