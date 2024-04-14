import { PurchaseListType } from "../types";

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
