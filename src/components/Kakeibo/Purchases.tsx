import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import {
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { PurchaseListType, PurchaseType } from "../../types";
import {
  calculateSpentAndIncomeResult,
  filterCurrentMonthPurchases,
  sumPrice,
} from "../../utilities/purchaseUtilities";
import DoughnutChart from "./DoughnutChart";
import AssetsList from "./AssetsList";
import { useAsset } from "../Context/AssetContext";

const Purchases = () => {
  const { sumAssets } = useAsset();

  const [purchaseList, setPurchaseList] = useState<PurchaseListType[]>([]);
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    //Logの取得
    const fetchPurchases = () => {
      const purchaseQuery = query(
        collection(db, "Purchases"),
        where("userId", "==", auth.currentUser?.uid),
        orderBy("date")
      );
      return onSnapshot(purchaseQuery, (querySnapshot) => {
        const purchasesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as PurchaseType),
        }));
        setPurchaseList(purchasesData);
      });
    };
    const unsubscribePurchases = fetchPurchases();

    // コンポーネントがアンマウントされるときに購読を解除
    return () => {
      unsubscribePurchases();
    };
  }, [auth.currentUser]);

  const today = new Date();

  const currentMoney =
    sumAssets +
    calculateSpentAndIncomeResult(
      purchaseList.filter((purchase) => purchase.date.toDate() < today)
    );

  const endOfMonthMoneyAmount =
    sumAssets +
    calculateSpentAndIncomeResult(
      purchaseList.filter(
        (purchase) =>
          purchase.date.toDate() <
          new Date(today.getFullYear(), today.getMonth() + 1, 1) //来月の0日=今月の末日
      )
    );

  const currentMonthSpentList = filterCurrentMonthPurchases(
    purchaseList.filter((purchases) => purchases.income === false)
  );
  const currentMonthSpent = sumPrice(currentMonthSpentList);

  const currentMonthIncomeList = filterCurrentMonthPurchases(
    purchaseList.filter((purchases) => purchases.income === true)
  );
  const currentMonthIncome = sumPrice(currentMonthIncomeList);

  return (
    <>
      <AssetsList />
      <Box>{"現在の所持金 " + currentMoney}</Box>
      <Box> {"今月の使用金額 " + currentMonthSpent}</Box>
      <Box>{"今月の収入" + currentMonthIncome} </Box>
      <Box>{"今月末の残高 " + endOfMonthMoneyAmount} </Box>
      <Box display="flex" flexWrap="wrap">
        <DoughnutChart
          purchaseList={currentMonthSpentList}
          title="今月の使用金額"
        />
        <DoughnutChart
          purchaseList={currentMonthIncomeList}
          title="今月の収入金額"
        />
      </Box>

      <TableContainer sx={{ marginY: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>日付</TableCell>
              <TableCell>品目</TableCell>
              <TableCell>金額</TableCell>
              <TableCell>カテゴリー</TableCell>
              <TableCell>収入</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseList.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>
                  {purchase.date.toDate().toLocaleString().split(" ")[0]}
                </TableCell>
                <TableCell> {purchase.title}</TableCell>
                <TableCell>{purchase.price + "円"}</TableCell>
                <TableCell>{purchase.category}</TableCell>
                <TableCell>{purchase.income ? "収入" : "支出"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Purchases;
