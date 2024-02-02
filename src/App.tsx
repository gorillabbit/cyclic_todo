import { Box } from "@mui/material";
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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // ユーザーがサインインしている場合、currentUserオブジェクトを使用
        setUser(currentUser);
      }
    });

    // コンポーネントのアンマウント時にリスナーを解除
    return () => unsubscribe();
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Box textAlign="center">
          <Header setUser={setUser} />
          {user && (
            <>
              <InputForms />
              <Box m={2}>
                <LogList />
                <TaskList />
              </Box>
            </>
          )}
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
