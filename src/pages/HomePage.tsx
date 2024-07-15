import { memo, useEffect, useState } from "react";
import HeaderTabs from "../components/Tabs";
import { Box } from "@mui/material";
import { TabProvider } from "../components/Context/TabContext";
import PurchasePage from "./PurchasePage";
import TaskPage from "./TaskPage";
import { useCookies } from "react-cookie";
import { AccountType, TabType } from "../types";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAccount } from "../hooks/useData";

type PlainHomePageProps = {
  tabValue: number;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
  pinnedTabNum: number;
  setPinnedTab: (name: "pinnedTab", value: number) => void;
  tabs: TabType[];
  Account: AccountType | undefined;
};

const PlainHomePage = memo(
  ({
    tabValue,
    setTabValue,
    pinnedTabNum,
    setPinnedTab,
    tabs,
    Account,
  }: PlainHomePageProps) => {
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
                      {tab.type === "task" && <TaskPage />}
                      {tab.type === "purchase" && <PurchasePage />}
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
  const [pinnedTab, setPinnedTab] = useCookies(["pinnedTab"]);
  const pinnedTabNum = pinnedTab.pinnedTab ? Number(pinnedTab.pinnedTab) : 0;
  const [tabValue, setTabValue] = useState<number>(pinnedTabNum);
  const [tabs, setTabs] = useState<TabType[]>([]);
  const { Account } = useAccount();

  useEffect(() => {
    if (!Account) return;
    const getTabsByAccount = async (account: AccountType) => {
      const dataPromises = account.useTabIds.map(async (id) => {
        const docSnap = await getDoc(doc(db, "Tabs", id));
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
      });
      const data = await Promise.all(dataPromises);
      return data.filter((tab) => tab !== null) as TabType[];
    };

    getTabsByAccount(Account).then((result) => setTabs(result));
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
