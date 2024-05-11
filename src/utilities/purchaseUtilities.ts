import { InputBaseComponentProps } from "@mui/material";
import { AssetListType, PurchaseListType } from "../types";

export const calculateSpentAndIncomeResult = (
  purchasesList: PurchaseListType[]
) =>
  purchasesList.reduce(
    (acc, purchase) =>
      purchase.income
        ? acc + Number(purchase.price)
        : acc - Number(purchase.price),
    0
  );

export const sumPrice = (purchasesList: PurchaseListType[]) =>
  purchasesList.reduce((acc, purchase) => acc + Number(purchase.price), 0);

export const filterCurrentMonthPurchases = (
  purchasesList: PurchaseListType[]
) =>
  purchasesList.filter(
    (purchase) => purchase.date.toDate().getMonth() === new Date().getMonth()
  );

export const numericProps: InputBaseComponentProps = {
  inputMode: "numeric",
  pattern: "[0-9]*",
};

export const isGroupPurchase = (purchase: PurchaseListType) =>
  purchase.method.timing === "翌月" && !purchase.childPurchaseId;

export const isValidatedNum = (value: string) => {
  const numValue = Number(value);
  if (numValue < 0) {
    alert("0未満は入力できません");
    return false;
  } else if (Number.isNaN(numValue)) {
    alert("不適切な入力です");
    return false;
  } else {
    return true;
  }
};

export const getFilteredPurchase = (
  purchasesList: PurchaseListType[],
  income: "income" | "spent"
) => {
  if (income === "income") {
    return purchasesList.filter((purchases) => purchases.income === true);
  } else {
    return purchasesList.filter((purchases) => purchases.income === false);
  }
};

export const getLatestBalance = (asset: AssetListType) =>
  Number(asset.balanceLog.slice(-1)[0].balance)
    ? Number(asset.balanceLog.slice(-1)[0].balance)
    : 0;
