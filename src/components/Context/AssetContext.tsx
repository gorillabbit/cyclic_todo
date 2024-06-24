import { ReactNode, createContext, memo, useMemo } from "react";
import { orderBy, where } from "firebase/firestore";
import { AssetListType } from "../../types.js";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";
import { getLatestBalance } from "../../utilities/purchaseUtilities";
import { useTab } from "../../hooks/useData.js";

type AssetContextType = {
  assetList: AssetListType[];
  sumAssets: number;
};

// Contextを作成（初期値は空のassetListとダミーのsetAssetList関数）
export const AssetContext = createContext<AssetContextType>({
  assetList: [],
  sumAssets: 0,
});

export const AssetProvider = memo(
  ({ children }: { children: ReactNode }): JSX.Element => {
    const { tabId } = useTab();
    const assetQueryConstraints = useMemo(
      () => [orderBy("timestamp"), where("tabId", "==", tabId)],
      [tabId]
    );
    const { documents: assetList } = useFirestoreQuery<AssetListType>(
      "Assets",
      assetQueryConstraints,
      true
    );
    const sumAssets = useMemo(
      () => assetList.reduce((acc, asset) => acc + getLatestBalance(asset), 0),
      [assetList]
    );

    const context = useMemo(() => {
      return { assetList, sumAssets };
    }, [assetList, sumAssets]);

    return (
      <AssetContext.Provider value={context}>{children}</AssetContext.Provider>
    );
  }
);
