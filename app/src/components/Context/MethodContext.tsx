import { ReactNode, createContext, memo, useEffect, useMemo, useState } from 'react';
import { MethodListType } from '../../types.js';
import { useTab } from '../../hooks/useData.js';
import { getMethod } from '../../api/combinedApi.js';

export type MethodContextType = {
    methodList: MethodListType[];
    fetchMethod: () => Promise<void>;
};

// Contextを作成（初期値は空のMethodListとダミーのsetMethodList関数）
export const MethodContext = createContext<MethodContextType>({
    methodList: [],
    fetchMethod: async () => {},
});

export const MethodProvider = memo(({ children }: { children: ReactNode }) => {
    const { tabId } = useTab();
    const [methodList, setMethodList] = useState<MethodListType[]>([]);

    const fetchMethod = async () => {
        const data = await getMethod({ tabId });
        setMethodList(data);
    };

    useEffect(() => {
        fetchMethod();
    }, []);

    const context = useMemo(() => {
        return { methodList, fetchMethod };
    }, [methodList]);

    return <MethodContext.Provider value={context}>{children}</MethodContext.Provider>;
});
