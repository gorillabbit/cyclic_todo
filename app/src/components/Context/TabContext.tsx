import { ReactNode, createContext, memo, useMemo } from 'react';
import { TabType } from '../../types';

export const TabContext = createContext<{ tabId: string; tab: TabType }>({
    tabId: '',
    tab: {
        id: '',
        name: '',
        createUserUid: '',
        type: 'task',
        sharedAccounts: [],
    },
});

export const TabProvider = memo(
    ({ children, tab }: { children: ReactNode; tab: TabType }): JSX.Element => {
        const context = useMemo(() => {
            return { tabId: tab.id, tab };
        }, [tab]);
        return (
            <TabContext.Provider value={context}>
                {children}
            </TabContext.Provider>
        );
    }
);
