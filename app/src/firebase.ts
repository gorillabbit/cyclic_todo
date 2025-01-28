/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
} from 'firebase/firestore';
import { getPerformance } from 'firebase/performance';
import {
    AccountType,
    TaskType,
    InputLogType,
    LogType,
    TaskInputType,
    AccountInputType,
    LogsCompleteLogsInputType,
    InputTabType,
} from './types';

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

const updateDocOperation = async (collectionName: string, id: string, feature: any) => {
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
    tab: 'Tabs',
};

export const addDocTask = (task: TaskInputType) =>
    addDocOperation(dbNames.task, { ...task, completed: false });
export const updateDocTask = (id: string, feature: Partial<TaskType>) =>
    updateDocOperation(dbNames.task, id, feature);
export const deleteDocTask = (id: string) => deleteDocOperation(dbNames.task, id);

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
export const deleteDocAccount = (id: string) => deleteDocOperation(dbNames.account, id);

export const addDocTab = (tab: InputTabType) => addDocOperation(dbNames.tab, tab);
export const updateDocTab = (id: string, updates: Partial<InputTabType>) =>
    updateDocOperation(dbNames.tab, id, updates);
export const deleteDocTab = (id: string) => deleteDocOperation(dbNames.tab, id);
