import { Box } from "@mui/material";
import { memo, useMemo } from "react";
import { PurchaseDataType } from "../../../../types/purchaseTypes";
import {
  isLaterPayment,
  sumSpentAndIncome,
} from "../../../../utilities/purchaseUtilities";
import BalanceChart from "./BalanceChart";
import MonthlyStackedBarChart from "./MonthlyBarChats";
import StackedBarChart from "./StackedBarChart";

type PlainDoughnutContainerProps = {
  currentMonthNetSpentList: PurchaseDataType[];
  currentMonthNetSpent: number;
  currentMonthPaymentList: PurchaseDataType[];
  currentMonthPayment: number;
  currentMonthPaymentCategoryList: PurchaseDataType[];
  currentMonthIncomeList: PurchaseDataType[];
  currentMonthIncome: number;
};

const PlainDoughnutContainer = memo(
  ({
    currentMonthNetSpentList,
    currentMonthNetSpent,
    currentMonthPaymentList,
    currentMonthPayment,
    currentMonthPaymentCategoryList,
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
        title={`今月の支払い金額(支払い方法ごと) ${-currentMonthPayment}円`}
      />
      <StackedBarChart
        purchaseList={currentMonthPaymentCategoryList}
        title={`今月の支払い金額 ${-currentMonthPayment}円`}
      />
      <StackedBarChart
        purchaseList={currentMonthIncomeList}
        title={`今月の収入金額 ${currentMonthIncome}円`}
      />

      <BalanceChart />
      <MonthlyStackedBarChart />
    </Box>
  )
);
// 全期間の推移グラフも表示する。
const DoughnutContainer = ({
  monthlyPurchases,
}: {
  monthlyPurchases: PurchaseDataType[];
}) => {
  const PurchasesWithoutTransfer = useMemo(
    () => monthlyPurchases.filter((p) => p.category !== "送受金"),
    [monthlyPurchases]
  );

  const currentMonthSpentList = PurchasesWithoutTransfer.filter(
    (p) => p.difference < 0
  );

  // 今月使った金額を示す。カードの支払は含まない
  const currentMonthNetSpentList = currentMonthSpentList.filter(
    (spent) => !isLaterPayment(spent)
  );
  const currentMonthNetSpent = sumSpentAndIncome(currentMonthNetSpentList);

  // 支払いが後払いの場合、カテゴリーを変更する
  const PayLaterCategoryPurchase = currentMonthSpentList.map((p) => ({
    ...p,
    category: isLaterPayment(p) ? p.method.label + "支払い" : p.category,
  }));
  // 今月の支払金額(カード払いをまとめる)
  const currentMonthPaymentList = PayLaterCategoryPurchase.filter(
    (spent) => !spent.childPurchaseId
  );
  const currentMonthPayment = sumSpentAndIncome(currentMonthPaymentList);

  // 今月の支払金額(カテゴリーごと)
  const currentMonthPaymentCategoryList = currentMonthSpentList.filter(
    (spent) => !spent.childPurchaseId
  );

  const currentMonthIncomeList = PayLaterCategoryPurchase.filter(
    (p) => p.difference > 0
  );
  const currentMonthIncome = sumSpentAndIncome(currentMonthIncomeList);

  const plainProps = {
    currentMonthNetSpentList,
    currentMonthNetSpent,
    currentMonthPaymentList,
    currentMonthPayment,
    currentMonthPaymentCategoryList,
    currentMonthIncomeList,
    currentMonthIncome,
  };
  // TODO 円グラフじゃなくて棒グラフに変更する
  return <PlainDoughnutContainer {...plainProps} />;
};

export default DoughnutContainer;
