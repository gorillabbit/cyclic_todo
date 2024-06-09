import { Box } from "@mui/material";
import { memo, useMemo } from "react";
import DoughnutChart from "./DoughnutChart";
import { PurchaseListType } from "../../../types";
import {
  isLaterPayment,
  filterPurchasesByIncomeType,
  sumSpentAndIncome,
} from "../../../utilities/purchaseUtilities";

type PlainDoughnutContainerProps = {
  currentMonthNetSpentList: PurchaseListType[];
  currentMonthNetSpent: number;
  currentMonthPaymentList: PurchaseListType[];
  currentMonthPayment: number;
  currentMonthIncomeList: PurchaseListType[];
  currentMonthIncome: number;
};

const PlainDoughnutContainer = memo(
  ({
    currentMonthNetSpentList,
    currentMonthNetSpent,
    currentMonthPaymentList,
    currentMonthPayment,
    currentMonthIncomeList,
    currentMonthIncome,
  }: PlainDoughnutContainerProps) => (
    <Box display="flex" flexWrap="wrap">
      <DoughnutChart
        purchaseList={currentMonthNetSpentList}
        title={`今月の使用金額 ${-currentMonthNetSpent}円`}
      />
      <DoughnutChart
        purchaseList={currentMonthPaymentList}
        title={`今月の支払い金額 ${-currentMonthPayment}円`}
      />
      <DoughnutChart
        purchaseList={currentMonthIncomeList}
        title={`今月の収入金額 ${currentMonthIncome}円`}
      />
    </Box>
  )
);

const DoughnutContainer = ({
  monthlyPurchases,
}: {
  monthlyPurchases: PurchaseListType[];
}) => {
  const PurchasesWithoutTransfer = useMemo(
    () => monthlyPurchases.filter((purchase) => purchase.category !== "送受金"),
    [monthlyPurchases]
  );
  const PayLaterCategoryPurchase = PurchasesWithoutTransfer.map((purchase) => ({
    ...purchase,
    category: isLaterPayment(purchase)
      ? purchase.method.label + "支払い"
      : purchase.category,
  }));

  const currentMonthSpentList = useMemo(
    () => filterPurchasesByIncomeType(PayLaterCategoryPurchase, "spent"),
    [PayLaterCategoryPurchase]
  );

  // 今月使った金額を示す。カードの支払は含まない
  const currentMonthNetSpentList = currentMonthSpentList.filter(
    (spent) => !isLaterPayment(spent)
  );
  const currentMonthNetSpent = useMemo(
    () => sumSpentAndIncome(currentMonthNetSpentList),
    [currentMonthNetSpentList]
  );

  // 今月の支払金額
  const currentMonthPaymentList = currentMonthSpentList.filter(
    (spent) => !spent.childPurchaseId
  );
  const currentMonthPayment = useMemo(
    () => sumSpentAndIncome(currentMonthPaymentList),
    [currentMonthPaymentList]
  );

  const currentMonthIncomeList = useMemo(
    () => filterPurchasesByIncomeType(PayLaterCategoryPurchase, "income"),
    [PayLaterCategoryPurchase]
  );

  const currentMonthIncome = useMemo(
    () => sumSpentAndIncome(currentMonthIncomeList),
    [currentMonthIncomeList]
  );

  const plainProps = {
    currentMonthNetSpentList,
    currentMonthNetSpent,
    currentMonthPaymentList,
    currentMonthPayment,
    currentMonthIncomeList,
    currentMonthIncome,
  };

  return <PlainDoughnutContainer {...plainProps} />;
};

export default DoughnutContainer;
