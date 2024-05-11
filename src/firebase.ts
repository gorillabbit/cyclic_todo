import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import {
  MethodType,
  AccountType,
  MethodListType,
  InputPurchaseRowType,
  TaskType,
  InputLogType,
  LogType,
  AccountLinkType,
  InputPurchaseType,
  InputPurchaseScheduleType,
  AssetType,
  TaskInputType,
  AccountInputType,
  AccountLinkInputType,
  LogsCompleteLogsInputType,
  InputAssetType,
} from "./types";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Performance Monitoring and get a reference to the service
getPerformance(app);

const addDocOperation = async (collectionName: string, data: any) => {
  try {
    return await addDoc(collection(db, collectionName), {
      ...data,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error(`addDoc error: `, e);
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
    console.error(`updateDoc error: `, e, collectionName, id, feature);
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

export const addDocTask = (task: TaskInputType) =>
  addDocOperation("tasks", { ...task, completed: false });
export const updateDocTask = (id: string, feature: Partial<TaskType>) =>
  updateDocOperation("tasks", id, feature);
export const deleteDocTask = (id: string) => deleteDocOperation("tasks", id);

export const addDocLog = (doc: InputLogType) =>
  addDocOperation("logs", { ...doc, reviewed: false });
export const updateDocLog = (id: string, feature: Partial<LogType>) =>
  updateDocOperation("logs", id, feature);
export const deleteDocLog = (id: string) => deleteDocOperation("logs", id);

export const addDocLogsCompleteLog = (log: LogsCompleteLogsInputType) =>
  addDocOperation("logsCompleteLogs", { ...log, processed: true });
export const deleteDocLogsCompleteLog = (id: string) =>
  deleteDocOperation("logsCompleteLogs", id);

export const addDocAccount = (account: AccountInputType) =>
  addDocOperation("Accounts", account);
export const updateDocAccount = (id: string, updates: Partial<AccountType>) =>
  updateDocOperation("Accounts", id, updates);
export const deleteDocAccount = (id: string) =>
  deleteDocOperation("Accounts", id);

export const addDocAccountLink = (link: AccountLinkInputType) =>
  addDocOperation("AccountLinks", link);
export const updateDocAccountLink = (
  id: string,
  updates: Partial<AccountLinkType>
) => updateDocOperation("AccountLinks", id, updates);
export const deleteDocAccountLink = (id: string) =>
  deleteDocOperation("AccountLinks", id);

export const addDocPurchase = (v: InputPurchaseType) =>
  addDocOperation("Purchases", v);
export const updateDocPurchase = (
  id: string,
  updates: Partial<InputPurchaseRowType>
) => updateDocOperation("Purchases", id, updates);
export const batchAddDocPurchase = (purchaseList: InputPurchaseType[]) => {
  const batch = writeBatch(db);
  // オブジェクトをバッチに追加
  purchaseList.forEach((obj) => {
    const docRef = doc(collection(db, "Purchases")); // collectionNameは適宜替えてください
    batch.set(docRef, obj);
  });
  // バッチ操作を実行
  batch.commit().catch((error) => console.error("バッチ書き込み失敗:", error));
};
export const deleteDocPurchase = (id: string) =>
  deleteDocOperation("Purchases", id);

export const PurchaseTemplates = "PurchaseTemplates";
export const addDocPurchaseTemplate = (v: InputPurchaseType) =>
  addDocOperation(PurchaseTemplates, v);
export const deleteDocPurchaseTemplate = (id: string) =>
  deleteDocOperation(PurchaseTemplates, id);

export const addDocAsset = (asset: InputAssetType) =>
  addDocOperation("Assets", asset);
export const updateDocAsset = (id: string, updates: Partial<AssetType>) =>
  updateDocOperation("Assets", id, updates);
export const deleteDocAsset = (id: string) => deleteDocOperation("Assets", id);

export const addDocPurchaseSchedule = (
  PurchaseSchedule: InputPurchaseScheduleType
) => addDocOperation("PurchaseSchedules", PurchaseSchedule);

export const addDocMethod = (v: MethodType) => {
  console.log(v);
  addDocOperation("Methods", v);
};
export const updateDocMethod = (id: string, updates: MethodListType) =>
  updateDocOperation("Methods", id, updates);
export const deleteDocMethod = (id: string) =>
  deleteDocOperation("Methods", id);
