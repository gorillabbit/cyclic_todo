import { deleteData } from './apiClient';

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

export const deleteTransferTemplate = async (id: string): Promise<{}> => {
    return deleteData('/transfer-template', id);
};

export const deletePurchaseTemplate = async (id: string): Promise<{}> => {
    return deleteData('/purchase-template', id);
};

export const deletePurchaseSchedule = async (id: string): Promise<{}> => {
    return deleteData('/purchase-schedule', id);
};