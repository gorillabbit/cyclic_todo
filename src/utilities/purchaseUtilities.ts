import { InputBaseComponentProps } from "@mui/material";
import { AssetListType, PurchaseListType } from "../types";

/**
 * 収支を合計する(収入は+、支出は-で表現されるので支出の合計は-になる)
 * @param purchasesList
 * @returns
 */
export const sumSpentAndIncome = (purchasesList: PurchaseListType[]) =>
  purchasesList.reduce(
    (acc, purchase) =>
      purchase.income
        ? acc + Number(purchase.price)
        : acc - Number(purchase.price),
    0
  );

export const numericProps: InputBaseComponentProps = {
  inputMode: "numeric",
  pattern: "[0-9]*",
};

/**
 * 後払いの支払いであるかチェックする
 * @param purchase
 * @returns boolean
 */
export const isLaterPayment = (purchase: PurchaseListType): boolean =>
  purchase.method.timing === "翌月" && !purchase.childPurchaseId;

/**
 * 数値が0以下、NaNかどうか
 * @param value
 * @returns
 */
export const isValidatedNum = (value: string): boolean => {
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

export const filterPurchasesByIncomeType = (
  purchasesList: PurchaseListType[],
  income: "income" | "spent"
) => {
  if (income === "income") {
    return purchasesList.filter((purchases) => purchases.income === true);
  } else {
    return purchasesList.filter((purchases) => purchases.income === false);
  }
};

/**
 * 最新の残高を取得する
 * @param asset
 * @returns
 */
export const getLatestBalance = (asset: AssetListType) =>
  Number(asset.balanceLog.slice(-1)[0].balance)
    ? Number(asset.balanceLog.slice(-1)[0].balance)
    : 0;
