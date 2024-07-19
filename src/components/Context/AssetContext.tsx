import { ReactNode, createContext, memo, useMemo } from "react";
import { orderBy, where } from "firebase/firestore";
import { AssetListType } from "../../types.js";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";
import { useTab } from "../../hooks/useData.js";
import { dbNames } from "../../firebase.js";

type AssetContextType = {
  assetList: AssetListType[];
};

// Contextを作成（初期値は空のassetListとダミーのsetAssetList関数）
export const AssetContext = createContext<AssetContextType>({
  assetList: [],
});

export const AssetProvider = memo(
  ({ children }: { children: ReactNode }): JSX.Element => {
    const { tabId } = useTab();
    const assetQueryConstraints = useMemo(
      () => [orderBy("timestamp"), where("tabId", "==", tabId)],
      [tabId]
    );
    const { documents: assetList } = useFirestoreQuery<AssetListType>(
      dbNames.asset,
      assetQueryConstraints,
      true
    );

    const context = useMemo(() => {
      return { assetList };
    }, [assetList]);

    return (
      <AssetContext.Provider value={context}>{children}</AssetContext.Provider>
    );
  }
);
