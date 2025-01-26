import { 
    InputPurchaseScheduleType, PurchaseScheduleType, MethodListType, AssetListType, TabListType 
} from '../types';
import { PurchaseDataType } from '../types/purchaseTypes';
import { updateData } from './apiClient';

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
