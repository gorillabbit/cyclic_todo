import { ReactNode, createContext, memo, useContext, useMemo } from "react";
import { orderBy } from "firebase/firestore";
import { PurchaseListType, PurchaseType } from "../../types.js";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";

type PurchaseContextType = {
  purchaseList: PurchaseListType[];
  categorySet: string[];
  methodSet: string[];
};

// Contextを作成（初期値は空のPurchaseListとダミーのsetPurchaseList関数）
export const PurchaseContext = createContext<PurchaseContextType>({
  purchaseList: [],
  categorySet: [],
  methodSet: [],
});

export const PurchaseProvider = memo(
  ({ children }: { children: ReactNode }): JSX.Element => {
    const purchaseQueryConstraints = useMemo(() => [orderBy("date")], []);
    const { documents: purchaseList } = useFirestoreQuery<
      PurchaseType,
      PurchaseListType
    >("Purchases", purchaseQueryConstraints);

    const categoryList = purchaseList.map((purchase) => purchase.category);
    const categorySet = categoryList.filter(
      (item, index) => categoryList.indexOf(item) === index && !!item
    );
    categorySet.push("");
    const methodList = purchaseList.map((purchase) => purchase.method);
    const methodSet = methodList.filter(
      (item, index) => methodList.indexOf(item) === index && !!item
    );
    methodSet.push("");

    const context = useMemo(() => {
      return { purchaseList, categorySet, methodSet };
    }, [categorySet, methodSet, purchaseList]);

    return (
      <PurchaseContext.Provider value={context}>
        {children}
      </PurchaseContext.Provider>
    );
  }
);

export const usePurchase = () => useContext(PurchaseContext);
