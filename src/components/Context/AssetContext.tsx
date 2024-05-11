import { ReactNode, createContext, memo, useContext, useMemo } from "react";
import { orderBy } from "firebase/firestore";
import { AssetListType, AssetType } from "../../types.js";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";
import { getLatestBalance } from "../../utilities/purchaseUtilities";

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
    const assetQueryConstraints = useMemo(() => [orderBy("timestamp")], []);
    const { documents: assetList } = useFirestoreQuery<
      AssetType,
      AssetListType
    >("Assets", assetQueryConstraints);
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

export const useAsset = () => useContext(AssetContext);
