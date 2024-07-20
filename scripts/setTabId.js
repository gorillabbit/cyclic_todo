import admin from "firebase-admin"
// サービスアカウントのJSONファイルのパスを指定
import serviceAccount from "./service_account.json" assert { type: 'json' };

// Firebase Admin SDK の初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const taskDbs = [
  "tasks",
  "logs",
  "logsCompleteLogs",
]

async function updateDocuments(dbName, updateData) {
  const collectionRef = db.collection(dbName);
  const snapshot = await collectionRef.get();

  const batch = db.batch();
  snapshot.forEach((docSnap) => {
    const docRef = collectionRef.doc(docSnap.id);

    batch.update(docRef, updateData); // ここに更新したいフィールドと値を指定
  });

  await batch.commit();
  console.log('Documents updated successfully.');
}

taskDbs.forEach((dbName) =>
  updateDocuments(dbName,  { tabId: 'task' }).catch(console.error)
);

const purchaseDbs = [
    "Purchases",
    "PurchaseTemplates",
    "Assets",
    "PurchaseSchedules",
    "Methods",
    "TransferTemplates",
]
purchaseDbs.forEach((dbName) =>
  updateDocuments(dbName,  { tabId: 'purchase' }).catch(console.error)
);



