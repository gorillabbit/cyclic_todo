const admin = require('firebase-admin');

// サービスアカウントのJSONファイルのパスを指定
const serviceAccount = require('./service_account.json');

// Firebase Admin SDK の初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const dbNames = {
  task: "tasks",
  log: "logs",
  logsCompleteLog: "logsCompleteLogs",
  account: "Accounts",
  accountLink: "AccountLinks",
  purchase: "Purchases",
  purchaseTemplate: "PurchaseTemplates",
  asset: "Assets",
  purchaseSchedule: "PurchaseSchedules",
  method: "Methods",
  transferTemplate: "TransferTemplates",
};

async function updateDocuments(dbName) {
  const collectionRef = db.collection(dbName);
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }

  const batch = db.batch();
  snapshot.forEach((docSnap) => {
    const docRef = collectionRef.doc(docSnap.id);
    batch.update(docRef, { userId: 'cgzX9wAXsgNxy6pucO4MM1wM1J93' }); // ここに更新したいフィールドと値を指定
  });

  await batch.commit();
  console.log('Documents updated successfully.');
}

Object.entries(dbNames).forEach((obj) =>
  updateDocuments(obj[1]).catch(console.error)
);

