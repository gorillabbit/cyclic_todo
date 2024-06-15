import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import express, { Application } from "express";
import { MethodListType } from "./types";
//import { Timestamp } from "firebase/firestore";
import cors from "cors";

initializeApp();

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use("/post", async (req, res) => {
  console.log(req.body);
  let data = {};
  await getFirestore()
    .collection("Methods")
    .doc(req.body.methodId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        data = doc.data() as MethodListType;
      } else {
        console.log("No such document!");
      }
    });
  console.log(data);
  const purchase = {
    title: req.body.title,
    price: req.body.price,
    date: new Date(),
    category: req.body.category,
    method: data as MethodListType,
    income: false,
    description: req.body.description,
    userId: "RSzGJ1om5iZMMvcmYBgThDhzpjc2",
    tabId: "oycy7tRzr40Tu3P91hPh",
    childPurchaseId: "",
  };
  const writeResult = await getFirestore()
    .collection("Purchases")
    .add(purchase);
  res
    .status(200)
    .json({ result: `Purchase with ID: ${writeResult.id} added.` });
});
app.use("/getCategory", async (_req, res) => {
  const categories: string[] = [];
  await getFirestore()
    .collection("Purchases")
    .where("userId", "==", "RSzGJ1om5iZMMvcmYBgThDhzpjc2")
    .select("category")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        categories.push(doc.data().category as unknown as string);
      });
    });
  console.log(categories);
  res.status(200).json([...new Set(categories)]);
});
app.use("/getMethods", async (_req, res) => {
  const methods: MethodListType[] = [];
  await getFirestore()
    .collection("Methods")
    .where("userId", "==", "RSzGJ1om5iZMMvcmYBgThDhzpjc2")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        methods.push(doc.data() as MethodListType);
      });
    });
  console.log(methods);
  res.status(200).json(methods);
});
exports.addPurchase = onRequest(app);
