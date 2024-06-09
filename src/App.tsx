import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./App.css";
import Header from "./components/Header";
import TaskList from "./components/Task/TaskList";
import LogList from "./components/Log/LogList";
import InputForms from "./components/InputForms/InputForms";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { LogProvider } from "./components/Context/LogContext";
import Calendar from "./components/Calendar/Calendar";
import { TaskProvider } from "./components/Context/TaskContext";
import { AccountProvider } from "./components/Context/AccountContext";
import Purchases from "./components/Kakeibo/PurchasesTable/Purchases";
import { AssetProvider } from "./components/Context/AssetContext";
import PurchaseInputs from "./components/Kakeibo/Input/InputsContainer";
import { PurchaseProvider } from "./components/Context/PurchaseContext";
import HeaderTabs from "./components/Tabs";
import { useCookies } from "react-cookie";
import { useIsSmall } from "./hooks/useWindowSize";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { AccountType, TabType } from "./types";
import { TabProvider } from "./components/Context/TabContext";
import { MethodProvider } from "./components/Context/MethodContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { db } from "./firebase";

const App = (): JSX.Element => {
  const theme = createTheme({
    typography: {
      fontFamily: [
        "Roboto",
        '"Noto Sans JP"',
        '"Helvetica"',
        "Arial",
        "sans-serif",
      ].join(","),
    },
  });
  const [Account, setAccount] = useState<AccountType>();
  const [isGapiMounted, setIsGapiMounted] = useState<boolean>(false);
  const [pinnedTab, setPinnedTab] = useCookies(["pinnedTab"]);
  const pinnedTabNum = pinnedTab.pinnedTab ? Number(pinnedTab.pinnedTab) : 0;
  const [tabValue, setTabValue] = useState<number>(pinnedTabNum);
  const isSmall = useIsSmall();
  const [tabs, setTabs] = useState<TabType[]>([]);

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

  const auth = getAuth();
  useEffect(() => {
    const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setAccount(undefined);
        return;
      }
      // リアルタイムでドキュメントのスナップショットを取得
      const unsubscribeFromDoc = onSnapshot(
        doc(db, "Accounts", user.uid),
        (accountDoc) => {
          setAccount(
            accountDoc.exists()
              ? ({ id: accountDoc.id, ...accountDoc.data() } as AccountType)
              : undefined
          );
        }
      );

      // クリーンアップ: アカウントドキュメントのスナップショットのリスナーを解除
      return () => unsubscribeFromDoc();
    });

    // クリーンアップ: 認証状態のリスナーを解除
    return () => unsubscribeFromAuth();
  }, [auth, setAccount]);
  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <AccountProvider {...{ Account }}>
            <Header {...{ setIsGapiMounted }} />
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
                    <TabProvider key={tab.id} tabId={tab.id}>
                      {tabValue === index && (
                        <>
                          {tab.type === "task" && (
                            <TaskProvider>
                              <LogProvider>
                                <Box m={2}>
                                  <InputForms />
                                </Box>
                                <Box m={isSmall ? 0 : 2}>
                                  <LogList />
                                  <TaskList />
                                  <Calendar isGapiMounted={isGapiMounted} />
                                </Box>
                              </LogProvider>
                            </TaskProvider>
                          )}
                          {tab.type === "purchase" && (
                            <MethodProvider>
                              <PurchaseProvider>
                                <AssetProvider>
                                  <Box m={2}>
                                    <PurchaseInputs />
                                  </Box>
                                  <Box m={isSmall ? 0 : 2}>
                                    <Purchases />
                                  </Box>
                                </AssetProvider>
                              </PurchaseProvider>
                            </MethodProvider>
                          )}
                        </>
                      )}
                    </TabProvider>
                  ))}
                </Box>
              </>
            )}
          </AccountProvider>
        </ThemeProvider>
      </LocalizationProvider>
      <Routes>
        <Route path="/Login" Component={LoginPage} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
