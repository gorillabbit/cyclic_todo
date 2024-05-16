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
  purchasesWithoutGroupFlag: PurchaseListType[];
  getGroupPurchases: (groupedPurchase: PurchaseListType) => PurchaseListType[];
  month: Date;
  handleNextMonthButton: () => void;
  handlePastMonthButton: () => void;
  isSmall: boolean;
  spentSum: number;
  incomeSum: number;
};

const PlainPurchases = memo(
  ({
    purchasesWithoutGroupFlag,
    getGroupPurchases,
    month,
    handleNextMonthButton,
    handlePastMonthButton,
    isSmall,
    spentSum,
    incomeSum,
  }: PlainPurchaseProps): JSX.Element => (
    <>
      <AssetsList />
      <PurchaseHeader purchaseList={purchasesWithoutGroupFlag} />
      <PurchaseSchedules />

      <Box display="flex" justifyContent="center">
        <Button onClick={handlePastMonthButton}>前の月</Button>
        <Box fontSize={20}>
          {"収支リスト " +
            month.getFullYear() +
            "年" +
            //getMonthは1月=0
            (month.getMonth() + 1) +
            "月"}
        </Box>
        <Button onClick={handleNextMonthButton}>次の月</Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ paddingX: 0.5 }}>支出</TableCell>
              <TableCell sx={{ paddingX: 0.5 }}>{spentSum}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell sx={{ paddingX: 0.5 }}>収入</TableCell>
              <TableCell sx={{ paddingX: 0.5 }}>{incomeSum}</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            {isSmall ? (
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
            {purchasesWithoutGroupFlag.map((purchase) => (
              <PurchasesRow
                purchase={purchase}
                key={purchase.id}
                groupPurchases={getGroupPurchases(purchase)}
                isSmall={isSmall}
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
  const [month, setMonth] = useState<Date>(new Date());
  const monthlyPurchases = useMemo(
    () =>
      purchaseList.filter(
        (purchase) => purchase.date.toDate().getMonth() === month.getMonth()
      ),
    [month, purchaseList]
  );

  const groupedPurchasesDoc = useMemo(() => {
    return monthlyPurchases.reduce((acc, purchase) => {
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
    }, {} as { [key: string]: PurchaseListType });
  }, [monthlyPurchases]);

  const groupedPurchases = useMemo(
    () => Object.values(groupedPurchasesDoc),
    [groupedPurchasesDoc]
  );

  const purchasesWithoutGroupFlag = useMemo(
    () =>
      [
        ...monthlyPurchases.filter((purchase) => !isGroupPurchase(purchase)),
        ...groupedPurchases,
      ].sort((a, b) => a.date.toMillis() - b.date.toMillis()),
    [monthlyPurchases, groupedPurchases]
  );

  const handleNextMonthButton = useCallback(() => {
    setMonth((prev) => addMonths(prev, 1));
  }, []);
  const handlePastMonthButton = useCallback(() => {
    setMonth((prev) => addMonths(prev, -1));
  }, []);

  // その月のPurchaseしか表示されないのでこれでいい
  const getGroupPurchases = useCallback(
    (groupedPurchase: PurchaseListType) =>
      monthlyPurchases.filter(
        (purchase) =>
          isGroupPurchase(purchase) &&
          purchase.method.id === groupedPurchase.method.id
      ),
    [monthlyPurchases]
  );

  const isSmall = useIsSmall();

  const spentSum = useMemo(
    () => sumPrice(getFilteredPurchase(purchasesWithoutGroupFlag, "spent")),
    [purchasesWithoutGroupFlag]
  );
  const incomeSum = useMemo(
    () => sumPrice(getFilteredPurchase(purchasesWithoutGroupFlag, "income")),
    [purchasesWithoutGroupFlag]
  );

  const plainProps = {
    purchasesWithoutGroupFlag,
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
