import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './App.css';
import Header from './components/Header';
import { memo, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AccountProvider } from './components/Context/AccountContext';
import { AccountType } from './types';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import KiyakuPage from './pages/KiyakuPage';
import ja from 'date-fns/locale/ja';
import { getAccount } from './api/getApi';

const App = memo(() => {
    const theme = createTheme({
        typography: {
            fontFamily: ['Roboto', '"Noto Sans JP"', '"Helvetica"', 'Arial', 'sans-serif'].join(
                ','
            ),
        },
    });
    const [Account, setAccount] = useState<AccountType>();

    const auth = getAuth();
    useEffect(() => {
        const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setAccount(undefined);
                return;
            }
            getAccount([{ field: 'id', value: user.uid }]).then((data) => {
                setAccount(data[0] as AccountType);
            });
        });

        // クリーンアップ: 認証状態のリスナーを解除
        return () => unsubscribeFromAuth();
    }, [auth, setAccount]);

    return (
        <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
                <ThemeProvider theme={theme}>
                    <AccountProvider {...{ Account }}>
                        <Header />
                        <Routes>
                            <Route path="/Login" Component={LoginPage} />
                            <Route path="/" Component={HomePage} />
                            <Route path="/kiyaku" Component={KiyakuPage} />
                        </Routes>
                    </AccountProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </BrowserRouter>
    );
});

export default App;
