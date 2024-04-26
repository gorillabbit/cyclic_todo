import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import {
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db, updateDocPurchase } from "../../firebase";
import {
  PurchaseListType,
  PurchaseScheduleListType,
  PurchaseScheduleType,
  PurchaseType,
} from "../../types";
import {
  calculateSpentAndIncomeResult,
  filterCurrentMonthPurchases,
  sumPrice,
} from "../../utilities/purchaseUtilities";
import DoughnutChart from "./DoughnutChart";
import AssetsList from "./AssetsList";
import { useAsset } from "../Context/AssetContext";
import { lastDayOfMonth } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";

const defaultNewPurchase: PurchaseListType = {
  id: "",
  userId: "",
  title: "",
  date: new Timestamp(0, 0),
  category: "",
  method: "",
  price: 0,
  income: false,
  description: "",
};

const Purchases = () => {
  const { sumAssets } = useAsset();
  const [purchaseList, setPurchaseList] = useState<PurchaseListType[]>([]);
  const [purchaseScheduleList, setPurchaseScheduleList] = useState<
    PurchaseScheduleListType[]
  >([]);
  // 編集中の行のIDを追跡するステート
  const [editRowId, setEditRowId] = useState<string>("");
  // 編集中のデータを保持するステート
  const [editFormData, setEditFormData] =
    useState<PurchaseListType>(defaultNewPurchase);
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    //Purchasesの取得
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

    const fetchPurchaseSchedules = () => {
      const purchaseScheduleQuery = query(
        collection(db, "PurchaseSchedules"),
        where("userId", "==", auth.currentUser?.uid)
      );
      return onSnapshot(purchaseScheduleQuery, (querySnapshot) => {
        const purchaseSchedulesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as PurchaseScheduleType),
        }));
        setPurchaseScheduleList(purchaseSchedulesData);
      });
    };
    const unsubscribePurchaseSchedules = fetchPurchaseSchedules();

    // コンポーネントがアンマウントされるときに購読を解除
    return () => {
      unsubscribePurchases();
      unsubscribePurchaseSchedules();
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
        (purchase) => purchase.date.toDate() < lastDayOfMonth(today)
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

  // 編集モードに切り替える関数
  const handleEditClick = (purchase: PurchaseListType) => {
    setEditRowId(purchase.id);
    setEditFormData(purchase);
  };

  // 編集内容を保存する関数
  const handleSaveClick = () => {
    // ここに保存ロジックを追加（API呼び出し等）
    updateDocPurchase(editFormData.id, editFormData);
    setEditRowId("");
  };

  // 編集データを更新する関数
  const handleEditFormChange = (event: {
    target: { name: string; value: any };
  }) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };
  const handleDateFormChange = (value: Date | null | undefined) => {
    if (value) {
      setEditFormData({
        ...editFormData,
        date: Timestamp.fromDate(value),
      });
    }
  };

  return (
    <>
      <AssetsList />
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
      <Paper sx={{ marginY: 2 }}>
        <Box fontSize={20}>サマリー</Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>指標名</TableCell>
                <TableCell>金額</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>現在の所持金</TableCell>
                <TableCell> {currentMoney}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>今月の使用金額</TableCell>
                <TableCell> {currentMonthSpent}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>今月の収入</TableCell>
                <TableCell> {currentMonthIncome}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>今月末の残高</TableCell>
                <TableCell> {endOfMonthMoneyAmount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ marginY: 2 }}>
        <Box fontSize={20}>予定収支</Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>周期</TableCell>
                <TableCell>品目</TableCell>
                <TableCell>金額</TableCell>
                <TableCell>カテゴリー</TableCell>
                <TableCell>支払い方法</TableCell>
                <TableCell>収入</TableCell>
                <TableCell>備考</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseScheduleList.map((purchaseSchedule) => (
                <TableRow key={purchaseSchedule.id}>
                  <TableCell>
                    {purchaseSchedule.cycle +
                      (purchaseSchedule.date
                        ? purchaseSchedule.date + "日"
                        : purchaseSchedule.day)}
                  </TableCell>
                  <TableCell> {purchaseSchedule.title}</TableCell>
                  <TableCell>{purchaseSchedule.price + "円"}</TableCell>
                  <TableCell>{purchaseSchedule.category}</TableCell>
                  <TableCell>{purchaseSchedule.method}</TableCell>
                  <TableCell>
                    {purchaseSchedule.income ? "収入" : "支出"}
                  </TableCell>
                  <TableCell>{purchaseSchedule.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ marginY: 2 }}>
        <Box fontSize={20}>収支リスト</Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>日付</TableCell>
                <TableCell>品目</TableCell>
                <TableCell>金額</TableCell>
                <TableCell>カテゴリー</TableCell>
                <TableCell>支払い方法</TableCell>
                <TableCell>収入</TableCell>
                <TableCell>備考</TableCell>
                <TableCell>編集</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseList.map((purchase) => (
                <TableRow key={purchase.id}>
                  {editRowId === purchase.id ? (
                    <>
                      <TableCell>
                        <DatePicker
                          name="date"
                          value={editFormData.date.toDate()}
                          onChange={handleDateFormChange}
                          slotProps={{ textField: { size: "small" } }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="title"
                          value={editFormData.title}
                          onChange={handleEditFormChange}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="price"
                          value={editFormData.price}
                          onChange={handleEditFormChange}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="category"
                          value={editFormData.category}
                          onChange={handleEditFormChange}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="method"
                          value={editFormData.method}
                          onChange={handleEditFormChange}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="income"
                          value={editFormData.income ? "収入" : "支出"}
                          onChange={handleEditFormChange}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditFormChange}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={handleSaveClick} variant="contained">
                          保存
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        {purchase.date.toDate().toLocaleString().split(" ")[0]}
                      </TableCell>
                      <TableCell> {purchase.title}</TableCell>
                      <TableCell>{purchase.price + "円"}</TableCell>
                      <TableCell>{purchase.category}</TableCell>
                      <TableCell>{purchase.method}</TableCell>
                      <TableCell>{purchase.income ? "収入" : "支出"}</TableCell>
                      <TableCell>{purchase.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => handleEditClick(purchase)}
                        >
                          編集
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default Purchases;
