import { Box } from "@mui/material";
import { memo, useMemo } from "react";
import DoughnutChart from "./DoughnutChart";
import { PurchaseListType } from "../../../types";
import {
  isLaterPayment,
  filterPurchasesByIncomeType,
} from "../../../utilities/purchaseUtilities";

type PlainDoughnutContainerProps = {
  currentMonthIncomeList: PurchaseListType[];
  currentMonthNetSpentList: PurchaseListType[];
  currentMonthPaymentList: PurchaseListType[];
};

const PlainDoughnutContainer = memo(
  ({
    currentMonthIncomeList,
    currentMonthNetSpentList,
    currentMonthPaymentList,
  }: PlainDoughnutContainerProps) => (
    <Box display="flex" flexWrap="wrap">
      <DoughnutChart
        purchaseList={currentMonthNetSpentList}
        title="今月の使用金額"
      />
      <DoughnutChart
        purchaseList={currentMonthPaymentList}
        title="今月の支払い金額"
      />
      <DoughnutChart
        purchaseList={currentMonthIncomeList}
        title="今月の収入金額"
      />
    </Box>
  )
);

const DoughnutContainer = ({
  monthlyPurchases,
}: {
  monthlyPurchases: PurchaseListType[];
}) => {
  const PayLaterCategoryPurchase = monthlyPurchases.map((purchase) => ({
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

  // 今月の支払金額
  const currentMonthPaymentList = currentMonthSpentList.filter(
    (spent) => !spent.childPurchaseId
  );

  const currentMonthIncomeList = useMemo(
    () => filterPurchasesByIncomeType(PayLaterCategoryPurchase, "income"),
    [PayLaterCategoryPurchase]
  );

  const plainProps = {
    currentMonthIncomeList,
    currentMonthNetSpentList,
    currentMonthPaymentList,
  };

  return <PlainDoughnutContainer {...plainProps} />;
};

export default DoughnutContainer;
