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
import { PurchaseListType } from "../../../types";
import { lastDayOfMonth } from "date-fns";
import {
  calculateSpentAndIncomeResult,
  getFilteredPurchase,
  isGroupPurchase,
} from "../../../utilities/purchaseUtilities";
import { useAsset } from "../../Context/AssetContext";

type PlainPurchaseHeaderProps = {
  currentMonthSpentList: PurchaseListType[];
  currentMonthIncomeList: PurchaseListType[];
  currentMoney: number;
  endOfMonthMoneyAmount: number;
};

const PlainPurchaseHeader = memo(
  ({
    currentMonthSpentList,
    currentMonthIncomeList,
    currentMoney,
    endOfMonthMoneyAmount,
  }: PlainPurchaseHeaderProps): JSX.Element => (
    <>
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
                <TableCell>{currentMoney}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>今月末の残高</TableCell>
                <TableCell>{endOfMonthMoneyAmount}</TableCell>
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
  const { sumAssets } = useAsset();
  const today = useMemo(() => new Date(), []);
  const currentMoney = useMemo(() => {
    const filteredPurchases = purchaseList.filter(
      (purchase) => purchase.date.toDate() < today && isGroupPurchase(purchase)
    );
    return sumAssets + calculateSpentAndIncomeResult(filteredPurchases);
  }, [purchaseList, sumAssets, today]);

  const endOfMonthMoneyAmount = useMemo(() => {
    const filteredPurchases = purchaseList.filter(
      (purchase) => purchase.date.toDate() < lastDayOfMonth(today)
    );
    return sumAssets + calculateSpentAndIncomeResult(filteredPurchases);
  }, [purchaseList, sumAssets, today]);

  const currentMonthSpentList = useMemo(
    () => getFilteredPurchase(purchaseList, "spent"),
    [purchaseList]
  );

  const currentMonthIncomeList = useMemo(
    () => getFilteredPurchase(purchaseList, "income"),
    [purchaseList]
  );
  const plainProps = {
    currentMonthSpentList,
    currentMonthIncomeList,
    currentMoney,
    endOfMonthMoneyAmount,
  };
  return <PlainPurchaseHeader {...plainProps} />;
};

export default PurchaseHeader;
