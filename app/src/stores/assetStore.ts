import { create } from 'zustand';
import { AssetListType } from '../types.js';
import { getAsset } from '../api/getApi.js';

type AssetState = {
    assetList: AssetListType[];
    fetchAsset: (tabId: string) => Promise<void>;
};

export const useAssetStore = create<AssetState>((set) => ({
    assetList: [],
    fetchAsset: async (tabId: string): Promise<void> => {
        const data = await getAsset(tabId);
        set({ assetList: data });
    },
}));
