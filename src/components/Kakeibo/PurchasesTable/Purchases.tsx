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
import PurchasesRow from "./PurchaseRow/PurchasesRow";
import AssetsList from "../Asset/AssetsList";
import { addMonths } from "date-fns";
import { useIsSmall } from "../../../hooks/useWindowSize";
import {
  filterPurchasesByIncomeType,
  isLaterPayment,
  sumSpentAndIncome,
} from "../../../utilities/purchaseUtilities";
import DoughnutContainer from "./DoughnutContainer";

type PlainPurchaseProps = {
  monthlyPurchases: PurchaseListType[];
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
    monthlyPurchases,
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
      <DoughnutContainer monthlyPurchases={monthlyPurchases} />
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
              <TableCell sx={{ px: 0.5 }}>支出</TableCell>
              <TableCell sx={{ px: 0.5 }}>{spentSum}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell sx={{ px: 0.5 }}>収入</TableCell>
              <TableCell sx={{ px: 0.5 }}>{incomeSum}</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="none" />
              <TableCell sx={{ px: 0.5 }}>日付</TableCell>
              <TableCell sx={{ px: 0.5 }}>品目</TableCell>
              <TableCell sx={{ px: 0.5 }}>金額</TableCell>
              {!isSmall && (
                <>
                  <TableCell sx={{ px: 0.5 }}>分類</TableCell>
                  <TableCell sx={{ px: 0.5 }}>支払い方法</TableCell>
                  <TableCell sx={{ px: 0.5 }}>収入</TableCell>
                  <TableCell sx={{ px: 0.5 }}>備考</TableCell>
                  <TableCell padding="none" />
                </>
              )}
            </TableRow>
            {isSmall && (
              <TableRow>
                <TableCell padding="none" />
                <TableCell sx={{ px: 0.5 }}>分類</TableCell>
                <TableCell sx={{ px: 0.5 }}>支払い方法</TableCell>
                <TableCell sx={{ px: 0.5 }}>収入</TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {purchasesWithoutGroupFlag.map((purchase, index) => (
              <PurchasesRow
                key={purchase.id}
                index={index}
                purchase={purchase}
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
        (purchase) =>
          purchase.date.toDate().getMonth() === month.getMonth() &&
          purchase.date.toDate().getFullYear() === month.getFullYear()
      ),
    [month, purchaseList]
  );

  // 後払いを合計する(収入に後払いはないので考慮しない)
  const groupedPurchasesDoc = useMemo(() => {
    return monthlyPurchases.reduce((acc, purchase) => {
      if (isLaterPayment(purchase)) {
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

  const groupedPayLaterPurchases = useMemo(
    () => Object.values(groupedPurchasesDoc),
    [groupedPurchasesDoc]
  );

  const neutralizedGroupedPayLaterPurchase = useMemo(
    () =>
      groupedPayLaterPurchases.map((groupedPayLaterPurchase) => ({
        ...groupedPayLaterPurchase,
        title: groupedPayLaterPurchase.method.label + "引き落し",
        category: "後支払い",
        isUncertain: false,
        description: "",
      })),
    [groupedPayLaterPurchases]
  );

  const purchasesWithoutGroupFlag = useMemo(
    () =>
      [
        // 後払いは合計したので、除外する
        ...monthlyPurchases.filter((purchase) => !isLaterPayment(purchase)),
        ...neutralizedGroupedPayLaterPurchase,
      ].sort((a, b) => a.date.toMillis() - b.date.toMillis()),
    [monthlyPurchases, neutralizedGroupedPayLaterPurchase]
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
          isLaterPayment(purchase) &&
          purchase.method.id === groupedPurchase.method.id
      ),
    [monthlyPurchases]
  );

  const isSmall = useIsSmall();

  // 支出を正の数字で表現する
  const spentSum = useMemo(
    () =>
      -sumSpentAndIncome(
        filterPurchasesByIncomeType(purchasesWithoutGroupFlag, "spent")
      ),
    [purchasesWithoutGroupFlag]
  );
  const incomeSum = useMemo(
    () =>
      sumSpentAndIncome(
        filterPurchasesByIncomeType(purchasesWithoutGroupFlag, "income")
      ),
    [purchasesWithoutGroupFlag]
  );

  const plainProps = {
    monthlyPurchases,
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
