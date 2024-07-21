import { Box } from "@mui/material";
import { memo, useMemo } from "react";
import {
  isLaterPayment,
  sumSpentAndIncome,
} from "../../../utilities/purchaseUtilities";
import { PurchaseDataType } from "../../../types/purchaseTypes";
import StackedBarChart from "./StackedBarChart";

type PlainDoughnutContainerProps = {
  currentMonthNetSpentList: PurchaseDataType[];
  currentMonthNetSpent: number;
  currentMonthPaymentList: PurchaseDataType[];
  currentMonthPayment: number;
  currentMonthIncomeList: PurchaseDataType[];
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
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <StackedBarChart
        purchaseList={currentMonthNetSpentList}
        title={`今月の使用金額 ${-currentMonthNetSpent}円`}
      />
      <StackedBarChart
        purchaseList={currentMonthPaymentList}
        title={`今月の支払い金額 ${-currentMonthPayment}円`}
      />
      <StackedBarChart
        purchaseList={currentMonthIncomeList}
        title={`今月の収入金額 ${currentMonthIncome}円`}
      />
    </Box>
  )
);

const DoughnutContainer = ({
  monthlyPurchases,
}: {
  monthlyPurchases: PurchaseDataType[];
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

  const currentMonthSpentList = PayLaterCategoryPurchase.filter(
    (p) => p.difference < 0
  );
  // 今月使った金額を示す。カードの支払は含まない
  const currentMonthNetSpentList = currentMonthSpentList.filter(
    (spent) => !isLaterPayment(spent)
  );
  const currentMonthNetSpent = sumSpentAndIncome(currentMonthNetSpentList);

  // 今月の支払金額
  const currentMonthPaymentList = currentMonthSpentList.filter(
    (spent) => !spent.childPurchaseId
  );
  const currentMonthPayment = sumSpentAndIncome(currentMonthPaymentList);

  const currentMonthIncomeList = PayLaterCategoryPurchase.filter(
    (p) => p.difference > 0
  );
  const currentMonthIncome = sumSpentAndIncome(currentMonthIncomeList);

  const plainProps = {
    currentMonthNetSpentList,
    currentMonthNetSpent,
    currentMonthPaymentList,
    currentMonthPayment,
    currentMonthIncomeList,
    currentMonthIncome,
  };
  // TODO 円グラフじゃなくて棒グラフに変更する
  return <PlainDoughnutContainer {...plainProps} />;
};

export default DoughnutContainer;
