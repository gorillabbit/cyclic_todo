import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  writeBatch
} from "firebase/firestore";
import { getPerformance } from "firebase/performance";

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


const addDocOperation = async (collectionName, data) => {
  try {
    return await addDoc(collection(db, collectionName), { ...data, timestamp: serverTimestamp() });
  } catch (e) {
    console.error(`addDoc error: `, e);
    throw new Error(`addDoc error: ${e}`);
  }
}

const updateDocOperation = async (collectionName, id, feature) => {
  try {
    return await updateDoc(doc(db, collectionName, id), feature)
  } catch (e) {
    console.error(`updateDoc error: `, e, collectionName, id, feature);
    throw new Error(`updateDoc error: ${e} ${collectionName} ${id} ${feature}`);
  }
}

const deleteDocOperation = async (collectionName, id) => {
  try {
    return await deleteDoc(doc(db, collectionName, id));
  } catch (e) {
    throw new Error(`deleteDoc error: ${e}`);
  }
}

export const addDocTask = (task) => addDocOperation('tasks', { ...task, completed: false });
export const updateDocTask = (id, feature) => updateDocOperation('tasks', id, feature);
export const deleteDocTask = (id) => deleteDocOperation('tasks', id);

export const addDocLog = (doc) => addDocOperation('logs', { ...doc, reviewed: false });
export const updateDocLog = (id, content) => updateDocOperation('logs', id, content);
export const deleteDocLog = (id) => deleteDocOperation('logs', id);

export const addDocLogsCompleteLog = (log) => addDocOperation('logsCompleteLogs', { ...log, processed: true });
export const updateDocLogsCompleteLog = (id, updates) => updateDocOperation('logsCompleteLogs', id, updates);
export const deleteDocLogsCompleteLog = (id) => deleteDocOperation('logsCompleteLogs', id);

export const addDocAccount = (account) => addDocOperation('Accounts', account);
export const updateDocAccount = (id, updates) => updateDocOperation('Accounts', id, updates);
export const deleteDocAccount = (id) => deleteDocOperation('Accounts', id);

export const addDocAccountLink = (link) => addDocOperation('AccountLinks', link);
export const updateDocAccountLink = (id, updates) => updateDocOperation('AccountLinks', id, updates);
export const deleteDocAccountLink = (id) => deleteDocOperation('AccountLinks', id);

export const addDocPurchase = (purchase) => addDocOperation('Purchases', purchase)
export const updateDocPurchase =  (id, updates) => updateDocOperation('Purchases', id, updates);
export const batchAddDocPurchase = (purchaseList) => {
  const batch = writeBatch(db);
  // オブジェクトをバッチに追加
  purchaseList.forEach(obj => {
  const docRef = doc(collection(db, "Purchases")); // collectionNameは適宜替えてください
  batch.set(docRef, obj);
  });
  // バッチ操作を実行
  batch.commit().catch(error => console.error("バッチ書き込み失敗:", error));
}
export const deleteDocPurchase = (id) => deleteDocOperation('Purchases', id)

export const addDocAsset = (asset) => addDocOperation("Assets", asset)
export const updateDocAsset = (id, updates) => updateDocOperation('Assets', id, updates);
export const deleteDocAsset = (id) => deleteDocOperation('Assets', id);

export const addDocPurchaseSchedule = (PurchaseSchedule) => addDocOperation("PurchaseSchedules", PurchaseSchedule)
