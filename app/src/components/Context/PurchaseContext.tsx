import { memo, ReactNode, useMemo, useState, useCallback, useEffect, createContext } from 'react';
import { useTab } from '../../hooks/useData';
import { PurchaseDataType } from '../../types/purchaseTypes';
import { getPurchases } from '../../utilities/apiClient';
import { parseDateFieldsDeep } from '../../utilities/parseJsonUtils.js';

export type PurchaseContextType = {
    purchaseList: PurchaseDataType[];
    categorySet: string[];
    setPurchaseList: (purchaseList: PurchaseDataType[]) => void;
    fetchPurchases: () => Promise<void>;
};

// Contextを作成（初期値は空のPurchaseListとダミーのsetPurchaseList関数）
export const PurchaseContext = createContext<PurchaseContextType>({
    purchaseList: [],
    categorySet: [],
    setPurchaseList: () => {},
    fetchPurchases: async () => {},
});

export const PurchaseProvider = memo(({ children }: { children: ReactNode }) => {
    const { tabId } = useTab();
    const [purchaseList, _setPurchaseList] = useState<PurchaseDataType[]>([]);

    const categoryList = purchaseList.map((purchase) => purchase.category);
    const categorySet = categoryList.filter(
        (item, index) => categoryList.indexOf(item) === index && !!item
    );
    categorySet.push('');

    const setPurchaseList = useCallback((purchaseList: PurchaseDataType[]) => {
        const orderedPurchaseList = purchaseList.sort(
            (a, b) => b.date.getTime() - a.date.getTime()
        );
        _setPurchaseList(orderedPurchaseList);
    }, []);

    const fetchPurchases = useCallback(async () => {
        const data = await getPurchases(tabId);
        const purchases = parseDateFieldsDeep(data, ['date', 'payDate', 'timestamp']);
        _setPurchaseList(purchases);
    }, [tabId]);

    useEffect(() => {
        fetchPurchases();
    }, [fetchPurchases, tabId]);

    const context = useMemo(() => {
        return {
            purchaseList,
            categorySet,
            setPurchaseList,
            fetchPurchases,
        };
    }, [categorySet, purchaseList, setPurchaseList, fetchPurchases]);

    return <PurchaseContext.Provider value={context}>{children}</PurchaseContext.Provider>;
});
