import { ReactNode, createContext, memo, useEffect, useMemo, useState } from 'react';
import { MethodListType } from '../../types.js';
import { useTab } from '../../hooks/useData.js';
import { getMethods } from '../../utilities/apiClient.js';

export type MethodContextType = {
    methodList: MethodListType[];
};

// Contextを作成（初期値は空のMethodListとダミーのsetMethodList関数）
export const MethodContext = createContext<MethodContextType>({
    methodList: [],
});

export const MethodProvider = memo(({ children }: { children: ReactNode }) => {
    const { tabId } = useTab();
    const [methodList, setMethodList] = useState<MethodListType[]>([]);

    useEffect(() => {
        getMethods(tabId).then((methods) => {
            setMethodList(methods);
            console.log('methods:', methods);
        });
    }, []);

    const context = useMemo(() => {
        return { methodList };
    }, [methodList]);

    return <MethodContext.Provider value={context}>{children}</MethodContext.Provider>;
});
