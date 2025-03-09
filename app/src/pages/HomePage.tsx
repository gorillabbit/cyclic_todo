import { memo, useEffect, useState } from 'react';
import HeaderTabs from '../components/Tabs';
import { Box } from '@mui/material';
import { TabProvider } from '../components/Context/TabContext';
import PurchasePage from './PurchasePage';
import TaskPage from './TaskPage';
import { useCookies } from 'react-cookie';
import { TabType } from '../types';
import { getTab } from '../api/getApi';
import { useAccountStore } from '../stores/accountStore';

const HomePage = memo(() => {
    const [pinnedTab, setPinnedTab] = useCookies(['pinnedTab']);
    const pinnedTabNum = pinnedTab.pinnedTab ? Number(pinnedTab.pinnedTab) : 0;
    const [tabValue, setTabValue] = useState<number>(pinnedTabNum);
    const [tabs, setTabs] = useState<TabType[]>([]);
    const { Account } = useAccountStore();

    useEffect(() => {
        if (!Account) return;
        getTab([{ field: 'id', value: Account.useTabIds }]).then((result) => setTabs(result));
    }, [Account]);

    return (
        <>
            {Account && (
                <>
                    <HeaderTabs
                        {...{
                            tabValue,
                            setTabValue,
                            pinnedTabNum,
                            setPinnedTab,
                            tabs,
                        }}
                    />
                    <Box textAlign="center">
                        {tabs.map((tab, index) => (
                            <TabProvider key={tab.id} tab={tab}>
                                {tabValue === index && (
                                    <>
                                        {tab.type === 'task' && <TaskPage />}
                                        {tab.type === 'purchase' && <PurchasePage />}
                                    </>
                                )}
                            </TabProvider>
                        ))}
                    </Box>
                </>
            )}
        </>
    );
});
export default HomePage;
