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
import { PurchaseListType } from "../../../types";
import { lastDayOfMonth } from "date-fns";
import { sumSpentAndIncome } from "../../../utilities/purchaseUtilities";
import { useAsset } from "../../../hooks/useData";

type PlainPurchaseHeaderProps = {
  currentMoney: number;
  endOfMonthMoneyAmount: number;
  categorySpent: {
    [key: string]: number;
  };
};

const PlainPurchaseHeader = memo(
  ({
    currentMoney,
    endOfMonthMoneyAmount,
    categorySpent,
  }: PlainPurchaseHeaderProps): JSX.Element => (
    <>
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
              <TableRow>
                <TableCell colSpan={2}>
                  <Table size="small" sx={{ m: 1 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>カテゴリー名</TableCell>
                        <TableCell>使用金額</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(categorySpent).map((category) => (
                        <TableRow key={category[0]}>
                          <TableCell>{category[0]}</TableCell>
                          <TableCell>{category[1]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
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
  const filteredPurchases = purchaseList.filter(
    (purchase) => purchase.date.toDate() < today
  );
  const currentMoney = useMemo(() => {
    return sumAssets + sumSpentAndIncome(filteredPurchases);
  }, [filteredPurchases, sumAssets]);

  const endOfMonthMoneyAmount = useMemo(() => {
    const filteredPurchases = purchaseList.filter(
      (purchase) => purchase.date.toDate() < lastDayOfMonth(today)
    );
    return sumAssets + sumSpentAndIncome(filteredPurchases);
  }, [purchaseList, sumAssets, today]);

  const categorySpent: { [key: string]: number } = {};
  filteredPurchases.forEach((purchase) => {
    if (categorySpent[purchase.category]) {
      categorySpent[purchase.category] += Number(purchase.price);
    } else {
      categorySpent[purchase.category] = Number(purchase.price);
    }
  });

  const plainProps = {
    currentMoney,
    endOfMonthMoneyAmount,
    categorySpent,
  };
  return <PlainPurchaseHeader {...plainProps} />;
};

export default PurchaseHeader;
