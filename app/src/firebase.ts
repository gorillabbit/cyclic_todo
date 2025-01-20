/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    writeBatch,
} from 'firebase/firestore';
import { getPerformance } from 'firebase/performance';
import {
    MethodType,
    AccountType,
    MethodListType,
    TaskType,
    InputLogType,
    LogType,
    InputPurchaseScheduleType,
    AssetType,
    TaskInputType,
    AccountInputType,
    LogsCompleteLogsInputType,
    InputAssetType,
    InputTransferType,
    InputPurchaseScheduleRowType,
    InputTabType,
} from './types';
import {
    defaultPurchaseData,
    InputFieldPurchaseType,
    PurchaseDataType,
} from './types/purchaseTypes';

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
getPerformance(app); // Initialize Performance Monitoring

// Utility functions for Firestore operations
const addDocOperation = async (collectionName: string, data: any) => {
    try {
        return await addDoc(collection(db, collectionName), {
            ...data,
            timestamp: new Date(),
        });
    } catch (e) {
        console.error('addDoc error: ', e);
        throw new Error(`addDoc error: ${e}`);
    }
};

const updateDocOperation = async (
    collectionName: string,
    id: string,
    feature: any
) => {
    try {
        return await updateDoc(doc(db, collectionName, id), feature);
    } catch (e) {
        throw new Error(`updateDoc error: ${e} ${collectionName} ${id} ${feature}`);
    }
};

const deleteDocOperation = async (collectionName: string, id: string) => {
    try {
        return await deleteDoc(doc(db, collectionName, id));
    } catch (e) {
        throw new Error(`deleteDoc error: ${e}`);
    }
};

// Firestore collection names
export const dbNames = {
    task: 'tasks',
    log: 'logs',
    logsCompleteLog: 'logsCompleteLogs',
    account: 'Accounts',
    purchase: 'Purchases',
    purchaseTemplate: 'PurchaseTemplates',
    asset: 'Assets',
    purchaseSchedule: 'PurchaseSchedules',
    method: 'Methods',
    transferTemplate: 'TransferTemplates',
    tab: 'Tabs',
};

export const addDocTask = (task: TaskInputType) =>
    addDocOperation(dbNames.task, { ...task, completed: false });
export const updateDocTask = (id: string, feature: Partial<TaskType>) =>
    updateDocOperation(dbNames.task, id, feature);
export const deleteDocTask = (id: string) =>
    deleteDocOperation(dbNames.task, id);

export const addDocLog = (doc: InputLogType) =>
    addDocOperation(dbNames.log, { ...doc, reviewed: false });
export const updateDocLog = (id: string, feature: Partial<LogType>) =>
    updateDocOperation(dbNames.log, id, feature);
export const deleteDocLog = (id: string) => deleteDocOperation(dbNames.log, id);

export const addDocLogsCompleteLog = (log: LogsCompleteLogsInputType) =>
    addDocOperation(dbNames.logsCompleteLog, { ...log, processed: true });
export const deleteDocLogsCompleteLog = (id: string) =>
    deleteDocOperation(dbNames.logsCompleteLog, id);

export const addDocAccount = (account: AccountInputType) =>
    addDocOperation(dbNames.account, account);
export const updateDocAccount = (id: string, updates: Partial<AccountType>) =>
    updateDocOperation(dbNames.account, id, updates);
export const deleteDocAccount = (id: string) =>
    deleteDocOperation(dbNames.account, id);

/**
 *
 * @param v InputPurchaseTypeの一部。ない部分はdefaultPurchaseInputで補完される
 * @returns
 */
export const addDocPurchase = (v: PurchaseDataType) =>
    addDocOperation(dbNames.purchase, {
        ...defaultPurchaseData,
        ...v,
    });
export const updateDocPurchase = (
    id: string,
    updates: Partial<PurchaseDataType>
) => updateDocOperation(dbNames.purchase, id, updates);
export const batchAddDocPurchase = (
    purchaseList: (PurchaseDataType & { id?: string })[]
) => {
    const batch = writeBatch(db);
    purchaseList.forEach((obj) => {
        if (obj.id) {
            const docRef = doc(collection(db, dbNames.purchase), obj.id);
            batch.set(docRef, obj);
        } else {
            const docRef = doc(collection(db, dbNames.purchase));
            batch.set(docRef, obj);
        }
    });
    batch.commit().catch((error) => console.error('バッチ書き込み失敗:', error));
};
export const bulkUpdateDocPurchase = async (
    purchaseList: PurchaseDataType[]
) => {
    const batch = writeBatch(db);
    purchaseList.forEach((obj: PurchaseDataType) => {
        const { id, ...updateFields } = obj; // id を取り除いて残りのフィールドを取得
        const docRef = doc(collection(db, dbNames.purchase), id);
        batch.update(docRef, updateFields);
    });
    try {
        return await batch.commit();
    } catch (error) {
        return console.error('バッチ書き込み失敗:', error);
    }
};

export const deleteDocPurchase = (id: string) =>
    deleteDocOperation(dbNames.purchase, id);

export const addDocPurchaseTemplate = (v: InputFieldPurchaseType & { tabId: string }) =>
    addDocOperation(dbNames.purchaseTemplate, v);
export const deleteDocPurchaseTemplate = (id: string) =>
    deleteDocOperation(dbNames.purchaseTemplate, id);

export const addDocAsset = (asset: InputAssetType) =>
    addDocOperation(dbNames.asset, asset);
export const updateDocAsset = (id: string, updates: Partial<AssetType>) =>
    updateDocOperation(dbNames.asset, id, updates);
export const deleteDocAsset = (id: string) =>
    deleteDocOperation(dbNames.asset, id);

export const addDocPurchaseSchedule = (v: InputPurchaseScheduleType) =>
    addDocOperation(dbNames.purchaseSchedule, v);
export const updateDocPurchaseSchedule = (
    id: string,
    updates: Partial<InputPurchaseScheduleRowType>
) => updateDocOperation(dbNames.purchaseSchedule, id, updates);
export const deleteDocPurchaseSchedule = (id: string) =>
    deleteDocOperation(dbNames.purchaseSchedule, id);

export const addDocMethod = (v: MethodType) =>
    addDocOperation(dbNames.method, v);
export const updateDocMethod = (id: string, updates: MethodListType) =>
    updateDocOperation(dbNames.method, id, updates);
export const deleteDocMethod = (id: string) =>
    deleteDocOperation(dbNames.method, id);

export const addDocTransferTemplate = (v: InputTransferType & { tabId: string }) =>
    addDocOperation(dbNames.transferTemplate, v);
export const deleteDocTransferTemplate = (id: string) =>
    deleteDocOperation(dbNames.transferTemplate, id);

export const addDocTab = (tab: InputTabType) =>
    addDocOperation(dbNames.tab, tab);
export const updateDocTab = (id: string, updates: Partial<InputTabType>) =>
    updateDocOperation(dbNames.tab, id, updates);
export const deleteDocTab = (id: string) => deleteDocOperation(dbNames.tab, id);
