import admin from 'firebase-admin';

// サービスアカウントのJSONファイルのパスを指定
import serviceAccount from './service_account_prd.json' assert { type: 'json' };

// Firebase Admin SDK の初期化
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const taskDbs = ['tasks', 'logs', 'logsCompleteLogs'];

async function updateDocuments(dbName, updateData) {
    const collectionRef = db.collection(dbName);
    const snapshot = await collectionRef
        .where('user_id', '==', 'RSzGJ1om5iZMMvcmYBgThDhzpjc2')
        .get();

    const batch = db.batch();
    snapshot.forEach((docSnap) => {
        const docRef = collectionRef.doc(docSnap.id);

        batch.update(docRef, updateData); // ここに更新したいフィールドと値を指定
    });

    await batch.commit();
    console.log('Documents updated successfully.');
}

taskDbs.forEach((dbName) =>
    updateDocuments(dbName, { tab_id: 'oYL4pIMfSnPj89SFP5YJ' }).catch(console.error)
);

const purchaseDbs = [
    'Purchases',
    'PurchaseTemplates',
    'Assets',
    'PurchaseSchedules',
    'Methods',
    'TransferTemplates',
];
purchaseDbs.forEach((dbName) =>
    updateDocuments(dbName, { tab_id: 'oycy7tRzr40Tu3P91hPh' }).catch(console.error)
);
