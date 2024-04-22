import { createContext, useState, useContext, useEffect } from "react";
import { db } from "../../firebase.js";
import {
  orderBy,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { AssetListType, AssetType } from "../../types.js";
import { getAuth } from "firebase/auth";

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
  const [assetList, setAssetList] = useState<AssetInputType[]>([]);
  const sumAssets = assetList.reduce(
    (acc, asset) => acc + Number(asset.balance),
    0
  );
  const auth = getAuth();

  // 資産データをFirestoreから読み込む
  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    const fetchAssets = () => {
      const assetQuery = query(
        collection(db, "Assets"),
        where("userId", "==", auth.currentUser?.uid),
        orderBy("timestamp")
      );
      return onSnapshot(assetQuery, (querySnapshot) => {
        const assetsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as AssetType),
        }));
        setAssetList(assetsData);
      });
    };
    const unsubscribeAssets = fetchAssets();

    // コンポーネントがアンマウントされるときに購読を解除
    return () => {
      unsubscribeAssets();
    };
  }, [auth.currentUser]);

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
