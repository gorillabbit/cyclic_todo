import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { memo, useMemo } from "react";
import DoughnutChart from "./DoughnutChart";
import { PurchaseListType } from "../../types";
import { lastDayOfMonth } from "date-fns";
import {
  calculateSpentAndIncomeResult,
  filterCurrentMonthPurchases,
  sumPrice,
} from "../../utilities/purchaseUtilities";
import { useAsset } from "../Context/AssetContext";

type PlainPurchaseHeaderProps = {
  currentMonthSpentList: PurchaseListType[];
  currentMonthIncomeList: PurchaseListType[];
  currentMoney: number;
  currentMonthSpent: number;
  currentMonthIncome: number;
  endOfMonthMoneyAmount: number;
};

const PlainPurchaseHeader = memo(
  (props: PlainPurchaseHeaderProps): JSX.Element => (
    <>
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
    </>
  )
);

const PurchaseHeader = ({
  purchaseList,
}: {
  purchaseList: PurchaseListType[];
}): JSX.Element => {
  //サマリーに表示する数字
  const { sumAssets } = useAsset();
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
  const plainProps = {
    currentMonthSpentList,
    currentMonthIncomeList,
    currentMoney,
    currentMonthSpent,
    currentMonthIncome,
    endOfMonthMoneyAmount,
  };
  return <PlainPurchaseHeader {...plainProps} />;
};

export default PurchaseHeader;
