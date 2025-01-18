import { PurchaseDataType } from "../../../../types/purchaseTypes";

export const generateColor = (index: number) => {
  const r = (index * 300) % 255;
  const g = (index * 600) % 255;
  const b = (index * 900) % 255;
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
};

export const makeCategorySet = (purchaseList: PurchaseDataType[]) => [
  ...new Set(purchaseList.map((p) => p.category)),
];
