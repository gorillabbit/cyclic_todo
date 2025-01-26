import { 
    InputPurchaseScheduleType, PurchaseScheduleType, MethodListType, AssetListType, TabListType 
} from '../types';
import { PurchaseDataType } from '../types/purchaseTypes';
import { baseUrl, updateData } from './apiClient';

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

export const callApi = async <T>(
    endpoint: string,
): Promise<T> => {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`,{
            method: 'PUT',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// 購入データ残高全更新
export const reCalcAllBalance = async ():Promise<Partial<PurchaseDataType>> => {
    return callApi('/purchase/re_calc_all');
};