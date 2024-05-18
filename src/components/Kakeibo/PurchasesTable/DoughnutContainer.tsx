import { Box } from "@mui/material";
import { memo, useMemo } from "react";
import DoughnutChart from "./DoughnutChart";
import { PurchaseListType } from "../../../types";
import {
  isLaterPayment,
  filterPurchasesByIncomeType,
} from "../../../utilities/purchaseUtilities";

type PlainDoughnutContainerProps = {
  currentMonthSpentList: PurchaseListType[];
  currentMonthIncomeList: PurchaseListType[];
};

const PlainDoughnutContainer = memo(
  ({
    currentMonthSpentList,
    currentMonthIncomeList,
  }: PlainDoughnutContainerProps) => (
    <Box display="flex" flexWrap="wrap">
      <DoughnutChart
        purchaseList={currentMonthSpentList}
        title="今月の使用金額"
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
    category: isLaterPayment(purchase) ? "カード支払い" : purchase.category,
  }));

  const currentMonthSpentList = useMemo(
    () => filterPurchasesByIncomeType(PayLaterCategoryPurchase, "spent"),
    [PayLaterCategoryPurchase]
  );

  const currentMonthIncomeList = useMemo(
    () => filterPurchasesByIncomeType(PayLaterCategoryPurchase, "income"),
    [PayLaterCategoryPurchase]
  );

  const plainProps = {
    currentMonthSpentList,
    currentMonthIncomeList,
  };

  return <PlainDoughnutContainer {...plainProps} />;
};

export default DoughnutContainer;
