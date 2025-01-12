import { db } from "./firebase.js";
import fs from "fs";

async function exportCollection(collectionName) {
  const colRef = db.collection(collectionName);
  const snapshot = await colRef.get();
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  fs.writeFileSync(
    `./data/${collectionName}.json`,
    JSON.stringify(data, null, 2)
  );
  console.log(`Exported ${collectionName} to JSON file.`);
}

async function exportAllCollections() {
  const collections = [
    "tasks",
    "logs",
    "logsCompleteLogs",
    "Accounts",
    "Purchases",
    "PurchaseTemplates",
    "Assets",
    "PurchaseSchedules",
    "Methods",
    "TransferTemplates",
    "Tabs",
  ];

  for (const collectionName of collections) {
    await exportCollection(collectionName);
  }
}

exportAllCollections().catch(console.error);
