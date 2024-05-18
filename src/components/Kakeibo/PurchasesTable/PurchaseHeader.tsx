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
import {
  sumSpentAndIncome,
  isLaterPayment,
} from "../../../utilities/purchaseUtilities";
import { useAsset } from "../../Context/AssetContext";

type PlainPurchaseHeaderProps = {
  currentMoney: number;
  endOfMonthMoneyAmount: number;
};

const PlainPurchaseHeader = memo(
  ({
    currentMoney,
    endOfMonthMoneyAmount,
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
      (purchase) => purchase.date.toDate() < today && isLaterPayment(purchase)
    );
    return sumAssets + sumSpentAndIncome(filteredPurchases);
  }, [purchaseList, sumAssets, today]);

  const endOfMonthMoneyAmount = useMemo(() => {
    const filteredPurchases = purchaseList.filter(
      (purchase) => purchase.date.toDate() < lastDayOfMonth(today)
    );
    return sumAssets + sumSpentAndIncome(filteredPurchases);
  }, [purchaseList, sumAssets, today]);

  const plainProps = {
    currentMoney,
    endOfMonthMoneyAmount,
  };
  return <PlainPurchaseHeader {...plainProps} />;
};

export default PurchaseHeader;
