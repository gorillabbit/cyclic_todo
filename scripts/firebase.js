import admin from "firebase-admin";

// サービスアカウントのJSONファイルのパスを指定
import serviceAccount from "./service_account.json" assert { type: "json" };

// Firebase Admin SDK の初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export const db = admin.firestore();
