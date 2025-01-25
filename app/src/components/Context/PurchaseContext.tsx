import { memo, ReactNode, useMemo, useState, useEffect, createContext } from 'react';
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
    const { tab_id } = useTab();
    const [purchaseList, setPurchaseList] = useState<PurchaseDataType[]>([]);

    const categoryList = purchaseList.map((purchase) => purchase.category);
    const categorySet = categoryList.filter(
        (item, index) => categoryList.indexOf(item) === index && !!item
    );
    categorySet.push('');

    const fetchPurchases = async () => {
        const data = await getPurchases([{ field: 'tab_id', value: tab_id }]);
        const purchases = parseDateFieldsDeep(data, ['date', 'payDate', 'timestamp']);
        const orderedPurchaseList = purchases.sort((a, b) => b.date.getTime() - a.date.getTime());
        setPurchaseList(orderedPurchaseList);
    };

    useEffect(() => {
        fetchPurchases();
    }, [tab_id]);

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
