import admin from "firebase-admin"
import serviceAccountPrd from "./service_account_prd.json" assert { type: 'json' };

// Firebase Admin SDK の初期化
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPrd),
  });
export const prdDb = admin.firestore();