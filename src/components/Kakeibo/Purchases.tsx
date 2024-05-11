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
import { useIsSmall } from "../../hooks/useWindowSize";
import { isGroupPurchase } from "../../utilities/purchaseUtilities";

type PlainPurchaseProps = {
  sortedPurchasesWithGroupFlag: PurchaseListType[];
  getGroupPurchases: (groupedPurchase: PurchaseListType) => PurchaseListType[];
  month: Date;
  handleNextMonthButton: () => void;
  handlePastMonthButton: () => void;
  isSmall: boolean;
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
                <TableCell />
                <TableCell sx={{ paddingX: 0.5 }}>日付</TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>品目</TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>金額</TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>分類</TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>支払い方法</TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>収入</TableCell>
                {!props.isSmall && <TableCell>備考</TableCell>}
                <TableCell padding="none"></TableCell>
                <TableCell padding="none"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.sortedPurchasesWithGroupFlag.map((purchase) => (
                <PurchasesRow
                  purchase={purchase}
                  key={purchase.id}
                  groupPurchases={props.getGroupPurchases(purchase)}
                  isSmall={props.isSmall}
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
  const [month, setMonth] = useState<Date>(new Date());
  const monthlyPurchases = useMemo(
    () =>
      purchaseList.filter(
        (purchase) => purchase.date.toDate().getMonth() === month.getMonth()
      ),
    [month, purchaseList]
  );

  const groupedPurchasesDoc = monthlyPurchases.reduce((acc, purchase) => {
    if (isGroupPurchase(purchase)) {
      const keyString = purchase.method.label + purchase.date.toMillis();
      if (!acc[keyString]) {
        acc[keyString] = {
          ...purchase,
          price: 0,
          date: purchase.date,
        };
      }
      acc[keyString].price += Number(purchase.price);
    }
    return acc;
  }, {} as GroupedPurchases);
  const groupedPurchases = Object.values(groupedPurchasesDoc);

  const purchasesWithoutGroupFlag = monthlyPurchases.filter(
    (purchase) => !isGroupPurchase(purchase)
  );
  purchasesWithoutGroupFlag.push(...groupedPurchases);

  const sortedPurchasesWithGroupFlag = purchasesWithoutGroupFlag.sort(
    (a, b) => a.date.toMillis() - b.date.toMillis()
  );

  const handleNextMonthButton = useCallback(() => {
    setMonth((prev) => addMonths(prev, 1));
  }, []);
  const handlePastMonthButton = useCallback(() => {
    setMonth((prev) => addMonths(prev, -1));
  }, []);

  // その月のPurchaseしか表示されないのでこれでいい
  const getGroupPurchases = (groupedPurchase: PurchaseListType) =>
    monthlyPurchases.filter(
      (purchase) =>
        isGroupPurchase(purchase) &&
        purchase.method.id === groupedPurchase.method.id
    );

  const isSmall = useIsSmall();

  const plainProps = {
    sortedPurchasesWithGroupFlag,
    getGroupPurchases,
    month,
    handleNextMonthButton,
    handlePastMonthButton,
    isSmall,
  };

  return <PlainPurchases {...plainProps} />;
};

export default Purchases;
