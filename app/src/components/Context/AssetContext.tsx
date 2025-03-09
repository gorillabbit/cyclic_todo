import { ReactNode, memo, useEffect } from 'react';
import { useTab } from '../../hooks/useData.js';
import { useAssetStore } from '../../stores/assetStore.js';

export const AssetProvider = memo(({ children }: { children: ReactNode }) => {
    const { fetchAsset } = useAssetStore();
    const { tabId } = useTab();

    useEffect(() => {
        if (tabId) {
            fetchAsset(tabId);
        }
    }, [tabId, fetchAsset]);

    return <>{children}</>;
});
