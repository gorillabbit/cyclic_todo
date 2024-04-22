import { Box, Tab, Tabs } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./App.css";
import Header from "./components/Header.js";
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

function App() {
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
        <Box textAlign="center">
          <Header setUser={setUser} setIsGapiMounted={setIsGapiMounted} />
          {user && (
            <>
              <AccountProvider>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                  <Tab label="タスク/ログ" />
                  <Tab label="家計簿" />
                </Tabs>
                {tabValue === 0 && <InputForms />}
                {tabValue === 1 && <PurchaseInputs />}
                <TaskProvider>
                  <LogProvider>
                    <Box m={2}>
                      {tabValue === 0 && (
                        <>
                          <LogList />
                          <TaskList />
                        </>
                      )}
                      <AssetProvider>
                        {tabValue === 1 && <Purchases />}
                      </AssetProvider>
                      <Calendar isGapiMounted={isGapiMounted} />
                    </Box>
                  </LogProvider>
                </TaskProvider>
              </AccountProvider>
            </>
          )}
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
