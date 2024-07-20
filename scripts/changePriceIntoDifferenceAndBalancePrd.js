import { prdDb } from "./firebasePrd.js";

async function updateDocuments() {
  const collectionRef = prdDb.collection("Purchases");
  const snapshot = await collectionRef.orderBy("date", "asc").get();

  if (snapshot.empty) {
    return console.error("データがありません");
  }

  const batch = prdDb.batch();
  const lastPurchases = {};
  const purchases = await Promise.all(
    snapshot._docs().map(async (docSnap) => {
      const docRef = collectionRef.doc(docSnap.id);
      const doc = await docRef.get();
      return { id: docRef.id, ...doc.data(), docRef };
    })
  );

  purchases
    .sort((a, b) => {
      b.date.toDate().getTime() - a.date.toDate().getTime();
    })
    .forEach((data) => {
      if (!data.tabId) return;
      const assetId = String(data.method.assetId);
      const lastPurchase = lastPurchases[assetId];
      if (!lastPurchase) {
        lastPurchases[assetId] = 0;
      }
      const difference =
        data.difference ?? (data.income ? data.price : -data.price);
      const balance =
        Number(lastPurchase ? lastPurchase : 0) +
        Number(data.childPurchaseId ? 0 : difference);
      batch.update(data.docRef, {
        difference,
        balance,
        assetId: data.method.assetId,
      });
      lastPurchases[assetId] = balance;
    });
  await batch.commit();
}

updateDocuments();
