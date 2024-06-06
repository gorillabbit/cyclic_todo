import { ReactNode, createContext, memo, useContext, useMemo } from "react";
import { orderBy, where } from "firebase/firestore";
import { PurchaseListType, PurchaseType } from "../../types.js";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";
import { useTab } from "./TabContext";

type PurchaseContextType = {
  purchaseList: PurchaseListType[];
  categorySet: string[];
};

// Contextを作成（初期値は空のPurchaseListとダミーのsetPurchaseList関数）
export const PurchaseContext = createContext<PurchaseContextType>({
  purchaseList: [],
  categorySet: [],
});

export const PurchaseProvider = memo(
  ({ children }: { children: ReactNode }): JSX.Element => {
    const { tabId } = useTab();
    const purchaseQueryConstraints = useMemo(
      () => [orderBy("date"), where("tabId", "==", tabId)],
      [tabId]
    );
    const { documents: purchaseList } = useFirestoreQuery<
      PurchaseType,
      PurchaseListType
    >("Purchases", purchaseQueryConstraints);

    const categoryList = purchaseList.map((purchase) => purchase.category);
    const categorySet = categoryList.filter(
      (item, index) => categoryList.indexOf(item) === index && !!item
    );
    categorySet.push("");

    const context = useMemo(() => {
      return { purchaseList, categorySet };
    }, [categorySet, purchaseList]);

    return (
      <PurchaseContext.Provider value={context}>
        {children}
      </PurchaseContext.Provider>
    );
  }
);

export const usePurchase = () => useContext(PurchaseContext);
