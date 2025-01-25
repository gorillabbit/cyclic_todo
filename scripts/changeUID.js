import { db } from './firebase.js';

const dbNames = {
    tabs: 'Tabs',
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
        batch.update(docRef, { user_id: 'cgzX9wAXsgNxy6pucO4MM1wM1J93' }); // ここに更新したいフィールドと値を指定
    });

    await batch.commit();
    console.log('Documents updated successfully.');
}

Object.entries(dbNames).forEach((obj) => updateDocuments(obj[1]).catch(console.error));
