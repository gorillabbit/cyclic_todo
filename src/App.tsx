import { Box, Tab, Tabs } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./App.css";
import Header from "./components/Header";
import TaskList from "./components/Task/TaskList";
import LogList from "./components/Log/LogList";
import InputForms from "./components/InputForms/InputForms";
import { useEffect, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { LogProvider } from "./components/Context/LogContext";
import Calendar from "./components/Calendar/Calendar";
import { TaskProvider } from "./components/Context/TaskContext";
import { AccountProvider } from "./components/Context/AccountContext";
import Purchases from "./components/Kakeibo/Purchases";
import { AssetProvider } from "./components/Context/AssetContext";
import PurchaseInputs from "./components/Kakeibo/PurchaseInputs";
import { PurchaseProvider } from "./components/Context/PurchaseContext";
import { MethodProvider } from "./components/Context/MethodContext";

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
  const [user, setUser] = useState<User>();
  const [isGapiMounted, setIsGapiMounted] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Header setUser={setUser} setIsGapiMounted={setIsGapiMounted} />
        {user && (
          <>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label="タスク/ログ" />
              <Tab label="家計簿" />
            </Tabs>
            <AccountProvider>
              <Box m={2}>
                {tabValue === 0 && (
                  <TaskProvider>
                    <LogProvider>
                      <InputForms />
                      <LogList />
                      <TaskList />
                      <Calendar isGapiMounted={isGapiMounted} />
                    </LogProvider>
                  </TaskProvider>
                )}
                {tabValue === 1 && (
                  <MethodProvider>
                    <PurchaseProvider>
                      <AssetProvider>
                        <PurchaseInputs />
                        <Purchases />
                      </AssetProvider>
                    </PurchaseProvider>
                  </MethodProvider>
                )}
              </Box>
            </AccountProvider>
          </>
        )}
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
