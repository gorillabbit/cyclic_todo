import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { MethodListType } from "./types";

initializeApp();

const app: Application = express();
const db = getFirestore();
const USER_ID = "RSzGJ1om5iZMMvcmYBgThDhzpjc2";

app.use(express.json());
app.use(cors());

const getDocumentData = async (collection: string, docId: string) => {
  const doc = await db.collection(collection).doc(docId).get();
  if (doc.exists) {
    return doc.data();
  } else {
    return null;
  }
};

app.use("/post", async (req, res) => {
  try {
    const { methodId, title, price, category, description } = req.body;
    const methodData = (await getDocumentData(
      "Methods",
      methodId
    )) as MethodListType;
    if (!methodData) {
      return res.status(404).json({ error: "Method not found" });
    }

    const purchase = {
      title,
      price,
      date: new Date(),
      category,
      method: methodData,
      income: false,
      description,
      userId: USER_ID,
      tabId: "oycy7tRzr40Tu3P91hPh",
      childPurchaseId: "",
    };
    const writeResult = await db.collection("Purchases").add(purchase);
    return res
      .status(200)
      .json({ result: `Purchase with ID: ${writeResult.id} added.` });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

app.use("/getCategory", async (_req, res) => {
  try {
    const querySnapshot = await db
      .collection("Purchases")
      .where("userId", "==", USER_ID)
      .select("category")
      .get();

    const categories = querySnapshot.docs.map((doc) => doc.data().category);
    res.status(200).json([...new Set(categories)]);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.use("/getMethods", async (_req: Request, res: Response) => {
  try {
    const querySnapshot = await db
      .collection("Methods")
      .where("userId", "==", USER_ID)
      .get();

    const methods = querySnapshot.docs.map(
      (doc) => doc.data() as MethodListType
    );
    res.status(200).json(methods);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

exports.addPurchase = onRequest(app);
