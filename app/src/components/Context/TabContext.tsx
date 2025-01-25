import { ReactNode, createContext, memo, useMemo } from 'react';
import { TabType } from '../../types';

export type TabContextType = {
    tab_id: string;
    tab: TabType;
};

export const TabContext = createContext<TabContextType>({
    tab_id: '',
    tab: {
        id: '',
        name: '',
        create_user_uid: '',
        type: 'task',
        shared_accounts: [],
    },
});

export const TabProvider = memo(({ children, tab }: { children: ReactNode; tab: TabType }) => {
    const context = useMemo(() => {
        return { tab_id: tab.id, tab };
    }, [tab]);
    return <TabContext.Provider value={context}>{children}</TabContext.Provider>;
});
