import {
  Autocomplete,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { Timestamp } from "firebase/firestore";
import { memo, useCallback, useMemo, useState } from "react";
import { deleteDocPurchase, updateDocPurchase } from "../../firebase";
import {
  PurchaseListType,
  PurchaseScheduleListType,
  PurchaseScheduleType,
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
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";
import { usePurchase } from "../Context/PurchaseContext";

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

type PlainPurchaseProps = {
  currentMonthSpentList: PurchaseListType[];
  currentMonthIncomeList: PurchaseListType[];
  currentMoney: number;
  currentMonthSpent: number;
  currentMonthIncome: number;
  endOfMonthMoneyAmount: number;
  purchaseScheduleList: PurchaseScheduleListType[];
  purchaseList: PurchaseListType[];
  editRowId: string;
  editFormData: PurchaseListType;
  categorySet: string[];
  methodSet: string[];
  handleEditFormChange: (event: {
    target: {
      name: string;
      value: any;
    };
  }) => void;
  handleDateFormChange: (value: Date | null | undefined) => void;
  handleSaveClick: () => void;
  handleEditClick: (purchase: PurchaseListType) => void;
  handleAutocompleteChange: (name: string, value: string | null) => void;
};

const PlainPurchases = memo(
  (props: PlainPurchaseProps): JSX.Element => (
    <>
      <AssetsList />
      <Box display="flex" flexWrap="wrap">
        <DoughnutChart
          purchaseList={props.currentMonthSpentList}
          title="今月の使用金額"
        />
        <DoughnutChart
          purchaseList={props.currentMonthIncomeList}
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
                <TableCell> {props.currentMoney}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>今月の使用金額</TableCell>
                <TableCell> {props.currentMonthSpent}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>今月の収入</TableCell>
                <TableCell> {props.currentMonthIncome}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>今月末の残高</TableCell>
                <TableCell> {props.endOfMonthMoneyAmount}</TableCell>
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
              {props.purchaseScheduleList.map((purchaseSchedule) => (
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
                <TableCell padding="none"></TableCell>
                <TableCell padding="none"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.purchaseList.map((purchase) => (
                <TableRow key={purchase.id}>
                  {props.editRowId === purchase.id ? (
                    <>
                      <TableCell>
                        <DatePicker
                          name="date"
                          value={props.editFormData.date.toDate()}
                          onChange={props.handleDateFormChange}
                          slotProps={{ textField: { size: "small" } }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="title"
                          value={props.editFormData.title}
                          onChange={props.handleEditFormChange}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="price"
                          value={props.editFormData.price}
                          onChange={props.handleEditFormChange}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Autocomplete
                          value={props.editFormData.category}
                          sx={{ minWidth: 150 }}
                          options={props.categorySet}
                          freeSolo
                          onChange={(e, v) =>
                            props.handleAutocompleteChange("category", v)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="カテゴリー"
                              size="small"
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Autocomplete
                          value={props.editFormData.method}
                          sx={{ minWidth: 150 }}
                          options={props.methodSet}
                          freeSolo
                          onChange={(e, v) =>
                            props.handleAutocompleteChange("method", v)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="支払い方法"
                              size="small"
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="income"
                          value={props.editFormData.income ? "収入" : "支出"}
                          onChange={props.handleEditFormChange}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="description"
                          value={props.editFormData.description}
                          onChange={props.handleEditFormChange}
                          size="small"
                        />
                      </TableCell>
                      <TableCell padding="none">
                        <IconButton
                          onClick={props.handleSaveClick}
                          color="success"
                        >
                          <DoneIcon />
                        </IconButton>
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
                      <TableCell padding="none">
                        <IconButton
                          onClick={() => props.handleEditClick(purchase)}
                          sx={{
                            "&:hover": {
                              color: "#1976d2", // Color on hover
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                  <TableCell padding="none">
                    <IconButton
                      onClick={() => deleteDocPurchase(purchase.id)}
                      sx={{
                        "&:hover": {
                          color: "#d32f2f", // Color on hover
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
);

const Purchases = (): JSX.Element => {
  const { sumAssets } = useAsset();

  // 編集中の行のIDを追跡するステート
  const [editRowId, setEditRowId] = useState<string>("");
  // 編集中のデータを保持するステート
  const [editFormData, setEditFormData] =
    useState<PurchaseListType>(defaultNewPurchase);

  const { purchaseList, categorySet, methodSet } = usePurchase();

  const purchaseScheduleQueryConstraints = useMemo(() => [], []);

  const { documents: purchaseScheduleList } = useFirestoreQuery<
    PurchaseScheduleType,
    PurchaseScheduleListType
  >("PurchaseSchedules", purchaseScheduleQueryConstraints);

  //サマリーに表示する数字
  const today = useMemo(() => new Date(), []);
  const currentMoney = useMemo(
    () =>
      sumAssets +
      calculateSpentAndIncomeResult(
        purchaseList.filter((purchase) => purchase.date.toDate() < today)
      ),
    [purchaseList, sumAssets, today]
  );
  const endOfMonthMoneyAmount = useMemo(
    () =>
      sumAssets +
      calculateSpentAndIncomeResult(
        purchaseList.filter(
          (purchase) => purchase.date.toDate() < lastDayOfMonth(today)
        )
      ),
    [purchaseList, sumAssets, today]
  );
  const currentMonthSpentList = useMemo(
    () =>
      filterCurrentMonthPurchases(
        purchaseList.filter((purchases) => purchases.income === false)
      ),
    [purchaseList]
  );
  const currentMonthSpent = useMemo(
    () => sumPrice(currentMonthSpentList),
    [currentMonthSpentList]
  );
  const currentMonthIncomeList = useMemo(
    () =>
      filterCurrentMonthPurchases(
        purchaseList.filter((purchases) => purchases.income === true)
      ),
    [purchaseList]
  );
  const currentMonthIncome = useMemo(
    () => sumPrice(currentMonthIncomeList),
    [currentMonthIncomeList]
  );

  // 編集モードに切り替える関数
  const handleEditClick = useCallback((purchase: PurchaseListType) => {
    setEditRowId(purchase.id);
    setEditFormData(purchase);
  }, []);

  // 編集内容を保存する関数
  const handleSaveClick = useCallback(() => {
    updateDocPurchase(editFormData.id, editFormData);
    setEditRowId("");
  }, [editFormData]);

  // 編集データを更新する関数
  const handleEditFormChange = useCallback(
    (event: { target: { name: string; value: any } }) => {
      const { name, value } = event.target;
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  // 日付はTimestampに変換する必要があるので変換する
  const handleDateFormChange = useCallback((value: Date | null | undefined) => {
    if (value) {
      setEditFormData((prev) => ({
        ...prev,
        date: Timestamp.fromDate(value),
      }));
    }
  }, []);

  const handleAutocompleteChange = useCallback(
    (name: string, value: string | null) => {
      console.log(name, value);
      setEditFormData((prev) => ({ ...prev, [name]: value ?? "" }));
    },
    []
  );

  const plainProps = {
    currentMonthSpentList,
    currentMonthIncomeList,
    currentMoney,
    currentMonthSpent,
    currentMonthIncome,
    endOfMonthMoneyAmount,
    purchaseScheduleList,
    purchaseList,
    editRowId,
    editFormData,
    categorySet,
    methodSet,
    handleEditFormChange,
    handleDateFormChange,
    handleAutocompleteChange,
    handleSaveClick,
    handleEditClick,
  };

  return <PlainPurchases {...plainProps} />;
};

export default Purchases;
