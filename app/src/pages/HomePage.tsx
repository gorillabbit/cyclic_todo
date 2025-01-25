import { memo, useEffect, useState } from 'react';
import HeaderTabs from '../components/Tabs';
import { Box } from '@mui/material';
import { TabProvider } from '../components/Context/TabContext';
import PurchasePage from './PurchasePage';
import TaskPage from './TaskPage';
import { useCookies } from 'react-cookie';
import { AccountType, TabType } from '../types';
import { useAccount } from '../hooks/useData';
import { getTabs } from '../utilities/apiClient';

type PlainHomePageProps = {
    tabValue: number;
    setTabValue: React.Dispatch<React.SetStateAction<number>>;
    pinnedTabNum: number;
    setPinnedTab: (name: 'pinnedTab', value: number) => void;
    tabs: TabType[];
    Account: AccountType | undefined;
};

const PlainHomePage = memo(
    ({ tabValue, setTabValue, pinnedTabNum, setPinnedTab, tabs, Account }: PlainHomePageProps) => {
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
    }
);

const HomePage = memo(() => {
    const [pinnedTab, setPinnedTab] = useCookies(['pinnedTab']);
    const pinnedTabNum = pinnedTab.pinnedTab ? Number(pinnedTab.pinnedTab) : 0;
    const [tabValue, setTabValue] = useState<number>(pinnedTabNum);
    const [tabs, setTabs] = useState<TabType[]>([]);
    const { Account } = useAccount();

    useEffect(() => {
        if (!Account) return;
        getTabs([{ field: 'id', value: Account.use_tab_ids }]).then((result) => setTabs(result));
    }, [Account]);

    const plainProps = {
        tabValue,
        setTabValue,
        pinnedTabNum,
        setPinnedTab,
        tabs,
        Account,
    };
    return <PlainHomePage {...plainProps} />;
});
export default HomePage;
