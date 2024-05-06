import { createContext, useContext, useMemo } from "react";
import { orderBy } from "firebase/firestore";
import { AssetListType, AssetType } from "../../types.js";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";

interface AssetContextProp {
  children: any;
}

type AssetContextType = {
  assetList: AssetInputType[];
  setAssetList: React.Dispatch<React.SetStateAction<AssetInputType[]>>;
  sumAssets: number;
};

// Contextを作成（初期値は空のlogListとダミーのsetLogList関数）
export const AssetContext = createContext<AssetContextType>({
  assetList: [],
  setAssetList: () => {},
  sumAssets: 0,
});

interface AssetInputType extends AssetListType {
  tempName?: string;
  tempBalance?: number;
}

export const AssetProvider: React.FC<AssetContextProp> = ({ children }) => {
  const assetQueryConstraints = useMemo(() => [orderBy("timestamp")], []);
  const { documents: assetList, setDocuments: setAssetList } =
    useFirestoreQuery<AssetType, AssetInputType>(
      "Assets",
      assetQueryConstraints
    );
  const sumAssets = assetList.reduce(
    (acc, asset) => acc + Number(asset.balance),
    0
  );

  return (
    <AssetContext.Provider
      value={{
        assetList,
        setAssetList,
        sumAssets,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

export const useAsset = () => useContext(AssetContext);
