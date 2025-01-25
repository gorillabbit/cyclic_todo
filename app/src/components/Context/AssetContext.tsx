import { ReactNode, createContext, memo, useEffect, useMemo, useState } from 'react';
import { AssetListType } from '../../types.js';
import { useTab } from '../../hooks/useData.js';
import { getAssets } from '../../utilities/apiClient.js';

export type AssetContextType = {
    assetList: AssetListType[];
};

// Contextを作成（初期値は空のassetListとダミーのsetAssetList関数）
export const AssetContext = createContext<AssetContextType>({
    assetList: [],
});

export const AssetProvider = memo(({ children }: { children: ReactNode }) => {
    const { tab_id } = useTab();
    const [assetList, setAssetList] = useState<AssetListType[]>([]);

    useEffect(() => {
        getAssets(tab_id).then((assets) => {
            setAssetList(assets);
        });
    }, []);

    const context = useMemo(() => {
        return { assetList };
    }, [assetList]);

    return <AssetContext.Provider value={context}>{children}</AssetContext.Provider>;
});
