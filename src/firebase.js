// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const addDocTask = (task) => {
  try {
    return addDoc(collection(db, "tasks"), {
      ...task,
      completed: false,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error("タスク追加エラー: ", e);
  }
};

export const deleteDocTask = (id) => {
  try {
    deleteDoc(doc(db, "tasks", id));
  } catch (e) {
    console.error("タスク削除エラー: ", e);
  }
};

export const updateDocTask = (id, feature) => {
  try {
    updateDoc(doc(db, "tasks", id), feature);
  } catch (e) {
    console.error("タスク切り替えエラー: ", e);
  }
};

export const addDocLog = (log) => {
  try {
    return addDoc(collection(db, "logs"), {
      ...log,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error("タスク追加エラー: ", e);
  }
};

export const deleteDocLog = (id) => {
  try {
    deleteDoc(doc(db, "logs", id));
  } catch (e) {
    console.error("記録削除エラー: ", e);
  }
};

export const addDocLogsCompleteLogs = (log) => {
  try {
    return addDoc(collection(db, "logsCompleteLogs"), {
      ...log,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error("タスク追加エラー: ", e);
  }
};

export const deleteDocLogsCompleteLogs = (id) => {
  try {
    deleteDoc(doc(db, "logsCompleteLogs", id));
  } catch (e) {
    console.error("logsCompleteLogs削除エラー: ", e);
  }
};
