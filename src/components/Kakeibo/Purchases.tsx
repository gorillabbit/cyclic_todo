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
} from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import { PurchaseListType } from "../../types";
import { usePurchase } from "../Context/PurchaseContext";
import PurchaseHeader from "./PurchaseHeader";
import PurchaseSchedules from "./PurchaseSchedules";
import PurchasesRow from "./PurchasesRow";
import AssetsList from "./AssetsList";
import { addMonths } from "date-fns";

type PlainPurchaseProps = {
  sortedPurchasesWithGroupFlag: PurchaseListType[];
  getGroupPurchases: (groupedPurchase: PurchaseListType) => PurchaseListType[];
  month: Date;
  handleNextMonthButton: () => void;
  handlePastMonthButton: () => void;
  monthlyPurchases: PurchaseListType[];
};

const PlainPurchases = memo(
  (props: PlainPurchaseProps): JSX.Element => (
    <>
      <AssetsList />
      <PurchaseHeader purchaseList={props.sortedPurchasesWithGroupFlag} />
      <PurchaseSchedules />

      <Paper sx={{ marginY: 2 }}>
        <Box display="flex" justifyContent="center">
          <Button onClick={props.handlePastMonthButton}>前の月</Button>
          <Box fontSize={20}>
            {"収支リスト " +
              props.month.getFullYear() +
              "年" +
              //getMonthは1月=0
              (props.month.getMonth() + 1) +
              "月"}
          </Box>
          <Button onClick={props.handleNextMonthButton}>次の月</Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
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
              {props.monthlyPurchases.map((purchase) => (
                <PurchasesRow
                  purchase={purchase}
                  key={purchase.id}
                  groupPurchases={props.getGroupPurchases(purchase)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
);

const Purchases = (): JSX.Element => {
  const { purchaseList } = usePurchase();

  interface GroupedPurchases {
    [key: string]: PurchaseListType;
  }

  const groupedPurchasesDoc = purchaseList.reduce((acc, purchase) => {
    if (purchase.group) {
      const keyString = purchase.group + purchase.date.toMillis();
      if (!acc[keyString]) {
        acc[keyString] = {
          ...purchase,
          group: purchase.group,
          price: 0,
          date: purchase.date,
        };
      }
      acc[keyString].price += Number(purchase.price);
    }
    return acc;
  }, {} as GroupedPurchases);
  const groupedPurchases = Object.values(groupedPurchasesDoc);

  const purchasesWithGroupFlag = purchaseList.filter(
    (purchase) => !purchase.group
  );
  purchasesWithGroupFlag.push(...groupedPurchases);

  const sortedPurchasesWithGroupFlag = purchasesWithGroupFlag.sort(
    (a, b) => a.date.toMillis() - b.date.toMillis()
  );

  const [month, setMonth] = useState<Date>(new Date());
  const handleNextMonthButton = useCallback(() => {
    setMonth((prev) => addMonths(prev, 1));
  }, []);
  const handlePastMonthButton = useCallback(() => {
    setMonth((prev) => addMonths(prev, -1));
  }, []);
  const monthlyPurchases = useMemo(
    () =>
      sortedPurchasesWithGroupFlag.filter(
        (purchase) => purchase.date.toDate().getMonth() === month.getMonth()
      ),
    [month, sortedPurchasesWithGroupFlag]
  );

  const getGroupPurchases = (groupedPurchase: PurchaseListType) => {
    return purchaseList.filter(
      (purchase) =>
        groupedPurchase.group && purchase.group === groupedPurchase.group
    );
  };

  const plainProps = {
    sortedPurchasesWithGroupFlag,
    getGroupPurchases,
    month,
    handleNextMonthButton,
    handlePastMonthButton,
    monthlyPurchases,
  };

  return <PlainPurchases {...plainProps} />;
};

export default Purchases;
