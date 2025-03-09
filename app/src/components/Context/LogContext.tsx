import { ReactNode, memo, useEffect } from 'react';
import { useTab } from '../../hooks/useData.js';
import { useAccountStore } from '../../stores/accountStore.js';
import { useLogStore } from '../../stores/logStore.js';

export const LogProvider = memo(({ children }: { children: ReactNode }) => {
    const { Account } = useAccountStore();
    const { tabId } = useTab();
    const { fetchLogs } = useLogStore();

    useEffect(() => {
        if (tabId && Account) {
            fetchLogs(tabId, Account.id ?? '');
        }
    }, [tabId, Account, fetchLogs]);

    return <>{children}</>;
});
