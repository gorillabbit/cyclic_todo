import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './App.css';
import Header from './components/Header';
import { memo, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AccountProvider } from './components/Context/AccountContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { AccountType } from './types';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { db } from './firebase';
import HomePage from './pages/HomePage';
import KiyakuPage from './pages/KiyakuPage';
import ja from 'date-fns/locale/ja';

const App = memo((): JSX.Element => {
    const theme = createTheme({
        typography: {
            fontFamily: [
                'Roboto',
                '"Noto Sans JP"',
                '"Helvetica"',
                'Arial',
                'sans-serif',
            ].join(','),
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
            // リアルタイムでドキュメントのスナップショットを取得
            const unsubscribeFromDoc = onSnapshot(
                doc(db, 'Accounts', user.uid),
                (accountDoc) => {
                    setAccount(
                        accountDoc.exists()
                            ? ({
                                  id: accountDoc.id,
                                  ...accountDoc.data(),
                              } as AccountType)
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
            <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={ja}
            >
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
