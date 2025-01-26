import { ReactNode, createContext, memo, useEffect, useMemo, useState } from 'react';
import { AssetListType } from '../../types.js';
import { useTab } from '../../hooks/useData.js';
import { getAsset } from '../../api/getApi.js';

export type AssetContextType = {
    assetList: AssetListType[];
    fetchAsset: () => Promise<void>;
};

// Contextを作成（初期値は空のassetListとダミーのsetAssetList関数）
export const AssetContext = createContext<AssetContextType>({
    assetList: [],
    fetchAsset: async () => {},
});

export const AssetProvider = memo(({ children }: { children: ReactNode }) => {
    const { tabId } = useTab();
    const [assetList, setAssetList] = useState<AssetListType[]>([]);

    const fetchAsset = async () => {
        const data = await getAsset(tabId);
        setAssetList(data);
    };

    useEffect(() => {
        fetchAsset();
    }, []);

    const context = useMemo(() => {
        return { assetList, fetchAsset };
    }, [assetList]);

    return <AssetContext.Provider value={context}>{children}</AssetContext.Provider>;
});
