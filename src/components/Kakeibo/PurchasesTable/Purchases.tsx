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
import { PurchaseListType } from "../../../types";
import { usePurchase } from "../../Context/PurchaseContext";
import PurchaseHeader from "./PurchaseHeader";
import PurchaseSchedules from "./PurchaseSchedules";
import PurchasesRow from "./PurchasesRow";
import AssetsList from "../Asset/AssetsList";
import { addMonths } from "date-fns";
import { useIsSmall } from "../../../hooks/useWindowSize";
import {
  getFilteredPurchase,
  isGroupPurchase,
  sumPrice,
} from "../../../utilities/purchaseUtilities";

type PlainPurchaseProps = {
  sortedPurchasesWithGroupFlag: PurchaseListType[];
  getGroupPurchases: (groupedPurchase: PurchaseListType) => PurchaseListType[];
  month: Date;
  handleNextMonthButton: () => void;
  handlePastMonthButton: () => void;
  isSmall: boolean;
  spentSum: number;
  incomeSum: number;
};

const PlainPurchases = memo(
  (props: PlainPurchaseProps): JSX.Element => (
    <>
      <AssetsList />
      <PurchaseHeader purchaseList={props.sortedPurchasesWithGroupFlag} />
      <PurchaseSchedules />

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

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ paddingX: 0.5 }}>支出</TableCell>
              <TableCell sx={{ paddingX: 0.5 }}>{props.spentSum}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell sx={{ paddingX: 0.5 }}>収入</TableCell>
              <TableCell sx={{ paddingX: 0.5 }}>{props.incomeSum}</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            {props.isSmall ? (
              <>
                <TableRow>
                  <TableCell padding="none" />
                  <TableCell sx={{ paddingX: 0.5 }}>日付</TableCell>
                  <TableCell sx={{ paddingX: 0.5 }}>品目</TableCell>
                  <TableCell sx={{ paddingX: 0.5 }}>金額</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell padding="none" />
                  <TableCell sx={{ paddingX: 0.5 }}>分類</TableCell>
                  <TableCell sx={{ paddingX: 0.5 }}>支払い方法</TableCell>
                  <TableCell sx={{ paddingX: 0.5 }}>収入</TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell padding="none" />
                <TableCell sx={{ paddingX: 0.5 }}>日付</TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>品目</TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>金額</TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>分類</TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>支払い方法</TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>収入</TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>備考</TableCell>
                <TableCell padding="none" />
                <TableCell padding="none" />
              </TableRow>
            )}
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

  const spentSum = sumPrice(
    getFilteredPurchase(sortedPurchasesWithGroupFlag, "spent")
  );
  const incomeSum = sumPrice(
    getFilteredPurchase(sortedPurchasesWithGroupFlag, "income")
  );

  const plainProps = {
    sortedPurchasesWithGroupFlag,
    getGroupPurchases,
    month,
    handleNextMonthButton,
    handlePastMonthButton,
    isSmall,
    spentSum,
    incomeSum,
  };

  return <PlainPurchases {...plainProps} />;
};

export default Purchases;
