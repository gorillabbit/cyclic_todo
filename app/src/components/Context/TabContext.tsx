import { ReactNode, createContext, memo, useMemo } from 'react';
import { TabType } from '../../types';

export type TabContextType = {
    tabId: string;
    tab: TabType;
};

export const TabContext = createContext<TabContextType>({
    tabId: '',
    tab: {
        id: '',
        name: '',
        createUserUid: '',
        type: 'task',
        sharedAccounts: [],
    },
});

export const TabProvider = memo(({ children, tab }: { children: ReactNode; tab: TabType }) => {
    const context = useMemo(() => {
        return { tabId: tab.id, tab };
    }, [tab]);
    return <TabContext.Provider value={context}>{children}</TabContext.Provider>;
});
