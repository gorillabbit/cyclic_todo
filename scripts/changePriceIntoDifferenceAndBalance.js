import { db } from "./firebase.js";
import fs from "fs";

async function updateDocuments() {
  const collectionRef = db.collection("Purchases");
  const snapshot = await collectionRef.orderBy("date", "asc").get();

  if (snapshot.empty) {
    return console.error("データがありません");
  }

  const batch = db.batch();
  const lastPurchases = {};
  const assets = {};
  const logs = [];
  const purchases = await Promise.all(
    snapshot._docs().map(async (docSnap) => {
      const docRef = collectionRef.doc(docSnap.id);
      const doc = await docRef.get();
      return { id: docRef.id, ...doc.data(), docRef };
    })
  );
  console.log(purchases);

  purchases
    .sort((a, b) => {
      b.date.toDate().getTime() - a.date.toDate().getTime();
    })
    .forEach((data) => {
      const assetId = String(data.method.assetId);
      const lastPurchase = lastPurchases[assetId];
      if (!lastPurchase) {
        lastPurchases[assetId] = 0;
      }
      if (!assets[data.method.id]) {
        assets[data.method.id] = {
          名前: data.method.label,
          assetId: data.method.assetId,
        };
      }

      const difference = data.income ? data.price : -data.price;
      const balance =
        Number(lastPurchase ?? 0) +
        Number(data.childPurchaseId ? 0 : difference);
      logs.push({
        id: data.id,
        title: data.title,
        //balance,
        //difference,
        date: data.date,
        seconds: data.date._seconds,
        dateStr: data.date.toDate(),
      });
      batch.update(data.docRef, {
        difference,
        balance,
      });
      lastPurchases[assetId] = balance;
    });

  fs.writeFileSync("output.json", JSON.stringify(logs));
  console.log(lastPurchases, assets);
  await batch.commit();
}

updateDocuments();
