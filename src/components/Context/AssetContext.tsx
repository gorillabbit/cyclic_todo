import { ReactNode, createContext, memo, useContext, useMemo } from "react";
import { orderBy } from "firebase/firestore";
import { AssetInputType, AssetType } from "../../types.js";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";

type AssetContextType = {
  assetList: AssetInputType[];
  setAssetList: React.Dispatch<React.SetStateAction<AssetInputType[]>>;
  sumAssets: number;
};

// Contextを作成（初期値は空のassetListとダミーのsetAssetList関数）
export const AssetContext = createContext<AssetContextType>({
  assetList: [],
  setAssetList: () => {},
  sumAssets: 0,
});

export const AssetProvider = memo(
  ({ children }: { children: ReactNode }): JSX.Element => {
    const assetQueryConstraints = useMemo(() => [orderBy("timestamp")], []);
    const { documents: assetList, setDocuments: setAssetList } =
      useFirestoreQuery<AssetType, AssetInputType>(
        "Assets",
        assetQueryConstraints
      );
    const sumAssets = useMemo(
      () => assetList.reduce((acc, asset) => acc + Number(asset.balance), 0),
      [assetList]
    );

    const context = useMemo(() => {
      return { assetList, setAssetList, sumAssets };
    }, [assetList, setAssetList, sumAssets]);

    return (
      <AssetContext.Provider value={context}>{children}</AssetContext.Provider>
    );
  }
);

export const useAsset = () => useContext(AssetContext);
