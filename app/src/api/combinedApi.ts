import { PurchaseScheduleType, InputPurchaseScheduleType, TransferType, MethodListType, AssetListType, TabListType, LogsCompleteLogsType, AccountType, TaskType, LogType } from '../types';
import { PurchaseDataType, InputFieldPurchaseType } from '../types/purchaseTypes';
import { fetchData } from './apiClient';
import { createApiFunction, createDeleteFunction, createGetFunction, createUpdateFunction } from './apiUtils';
import { GetSingleFunction } from './types';
// Purchase
export const createPurchase = createApiFunction<PurchaseDataType>('purchase');
export const getPurchase = createGetFunction<PurchaseDataType>('purchase');
export const updatePurchase = createUpdateFunction<PurchaseDataType>('purchase');
export const deletePurchase = createDeleteFunction('purchase');

// PurchaseSchedule
export const createPurchaseSchedule = createApiFunction<PurchaseScheduleType>('purchaseSchedule');
export const getPurchaseSchedule = createGetFunction<PurchaseScheduleType>('purchaseSchedule');
export const updatePurchaseSchedule = createUpdateFunction<InputPurchaseScheduleType>('purchaseSchedule');
export const deletePurchaseSchedule = createDeleteFunction('purchaseSchedule');

// PurchaseTemplate
export const createPurchaseTemplate = createApiFunction<InputFieldPurchaseType>('purchaseTemplate');
export const getPurchaseTemplate = createGetFunction<InputFieldPurchaseType>('purchaseTemplate');
export const updatePurchaseTemplate = createUpdateFunction<InputFieldPurchaseType>('purchaseTemplate');
export const deletePurchaseTemplate = createDeleteFunction('purchaseTemplate');

// TransferTemplate
export const createTransferTemplate = createApiFunction<TransferType>('transferTemplate');
export const getTransferTemplate = createGetFunction<TransferType>('transferTemplate');
export const updateTransferTemplate = createUpdateFunction<TransferType>('transferTemplate');
export const deleteTransferTemplate = createDeleteFunction('transferTemplate');

// Method
export const createMethod = createApiFunction<MethodListType>('method');
export const getMethod = createGetFunction<MethodListType>('method');
export const updateMethod = createUpdateFunction<MethodListType>('method');
export const deleteMethod = createDeleteFunction('method');

// Asset
export const createAsset = createApiFunction<AssetListType>('asset');
export const getAsset = createGetFunction<AssetListType>('asset');
export const updateAsset = createUpdateFunction<AssetListType>('asset');
export const deleteAsset = createDeleteFunction('asset');

// Tab
export const createTab = createApiFunction<TabListType>('tab');
export const getTab = createGetFunction<TabListType>('tab');
export const updateTab = createUpdateFunction<TabListType>('tab');
export const deleteTab = createDeleteFunction('tab');

// Log
export const createLog = createApiFunction<LogType>('log');
export const getLog = createGetFunction<LogType>('log');
export const updateLog = createUpdateFunction<LogType>('log');
export const deleteLog = createDeleteFunction('log');

// LogCompleteLog
export const createLogCompleteLog = createApiFunction<LogsCompleteLogsType>('logCompleteLog');
export const getLogCompleteLog = createGetFunction<LogsCompleteLogsType>('logCompleteLog');
export const updateLogCompleteLog = createUpdateFunction<LogsCompleteLogsType>('logCompleteLog');
export const deleteLogCompleteLog = createDeleteFunction('logCompleteLog');

// Account
export const createAccount = createApiFunction<AccountType>('account');
export const getAccount = createGetFunction<AccountType>('account');
export const updateAccount = createUpdateFunction<AccountType>('account');
export const deleteAccount = createDeleteFunction('account');
export const getAccountDetails: GetSingleFunction<AccountType> = (id: string) => fetchData<AccountType>(`/account/${id}`);

// Task
export const createTask = createApiFunction<TaskType>('task');
export const getTask = createGetFunction<TaskType>('task');
export const updateTask = createUpdateFunction<TaskType>('task');
export const deleteTask = createDeleteFunction('task');

// callApi (汎用的なAPI呼び出し関数)
export const callApi = async <T>(endpoint: string): Promise<T> => {
    const baseUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL;
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
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

// reCalcAllBalance (callApiを使用)
export const reCalcAllBalance = async (tabId: string): Promise<any> => {
    return callApi(`/purchase/re_calc_all/${tabId}`);
};