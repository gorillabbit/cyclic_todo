import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import { memo, useCallback, useState } from 'react';
import { addDocTab, app, db, updateDocAccount } from '../firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { AccountType, defaultAccountInput } from '../types';

type PlainLoginPageProps = {
    Fields: {
        email: string;
        password: string;
        name: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    handleLogin: () => void;
    handleSignIn: () => void;
    handleGoogleLogin: () => void;
    toggleButton: string;
    handleToggleButton: (value: string) => void;
    error: string;
    agreeWithTerms: boolean;
    setAgreeWithTerms: (value: boolean) => void;
};

const PlainLoginPage = memo(
    ({
        Fields,
        handleInputChange,
        handleLogin,
        handleSignIn,
        handleGoogleLogin,
        toggleButton,
        handleToggleButton,
        error,
        agreeWithTerms,
        setAgreeWithTerms,
    }: PlainLoginPageProps) => {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" m={1} gap={1}>
                <Box>ログインページ</Box>
                <ToggleButtonGroup
                    value={toggleButton}
                    onChange={(_e, v) => handleToggleButton(v)}
                    exclusive
                >
                    <ToggleButton value="login">ログイン</ToggleButton>
                    <ToggleButton value="signIn">新規登録</ToggleButton>
                </ToggleButtonGroup>
                <TextField
                    label="メールアドレス"
                    name="email"
                    value={Fields.email}
                    onChange={handleInputChange}
                />
                <TextField
                    label="パスワード"
                    name="password"
                    value={Fields.password}
                    onChange={handleInputChange}
                />
                {toggleButton === 'signIn' && (
                    <TextField
                        label="表示名"
                        name="name"
                        value={Fields.name}
                        onChange={handleInputChange}
                    />
                )}
                {toggleButton === 'signIn' && (
                    <>
                        <a
                            href="https://kiyac.app/privacypolicy/acPsTW24zNWV7gdS6Ez4"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            プライバシーポリシー
                        </a>
                        <Link to="/kiyaku">利用規約</Link>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value={agreeWithTerms}
                                    onChange={() => setAgreeWithTerms(!agreeWithTerms)}
                                />
                            }
                            label="利用規約に同意する"
                        />
                        このサービスを利用することで、プライバシーポリシー・利用規約に同意したものとみなされます。
                    </>
                )}
                {error && <Box color="red">{error}</Box>}
                {toggleButton === 'login' && <Button onClick={handleLogin}>ログイン</Button>}
                {toggleButton === 'signIn' && <Button onClick={handleSignIn}>新規登録</Button>}
                <Button onClick={handleGoogleLogin}>Googleでログイン</Button>
            </Box>
        );
    }
);

const LoginPage = () => {
    const [toggleButton, setToggleButton] = useState<string>('login');
    const [Fields, setFields] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [error, setError] = useState<string>('');
    const auth = getAuth(app);
    const navigate = useNavigate();
    const [agreeWithTerms, setAgreeWithTerms] = useState<boolean>(false);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            const { value, name } = e.target;
            setFields((prev) => ({ ...prev, [name]: value }));
        },
        []
    );

    const successLogin = useCallback(() => {
        setError('');
        navigate('/');
    }, [navigate]);

    const handleToggleButton = useCallback((value: string) => {
        if (value !== null) {
            setToggleButton(value);
        }
    }, []);

    const handleLogin = useCallback(() => {
        if (!Fields.email || !Fields.password) {
            alert('メールアドレスとパスワードを入力してください');
            return;
        }
        signInWithEmailAndPassword(auth, Fields.email, Fields.password)
            .then(() => {
                successLogin();
            })
            .catch((error) => {
                setError('ログインに失敗しました:' + error.code + error.message);
            });
    }, [Fields.email, Fields.password, auth, successLogin]);

    const createDefaultTabs = useCallback(async (account: AccountType) => {
        const tabIds: string[] = [];

        const taskTabDoc = await addDocTab({
            createUserUid: account.id,
            name: 'タスク/ログ',
            type: 'task',
            sharedAccounts: [account],
        });
        tabIds.push(taskTabDoc.id);

        const purchaseTabDoc = await addDocTab({
            createUserUid: account.id,
            name: '家計簿',
            type: 'purchase',
            sharedAccounts: [account],
        });
        tabIds.push(purchaseTabDoc.id);

        await updateDocAccount(account.id, { useTabIds: tabIds });
    }, []);

    const accountRef = collection(db, 'Accounts');
    const handleSignIn = useCallback(() => {
        if (!Fields.email || !Fields.password) {
            return alert('メールアドレスとパスワードを入力してください');
        }
        if (!agreeWithTerms) {
            return alert('利用規約に同意してください');
        }
        createUserWithEmailAndPassword(auth, Fields.email, Fields.password)
            .then(async (userCredential) => {
                const newAccount = {
                    ...defaultAccountInput,
                    email: Fields.email,
                    name: Fields.name,
                };
                await setDoc(doc(accountRef, userCredential.user.uid), newAccount);
                createDefaultTabs({
                    ...newAccount,
                    id: userCredential.user.uid,
                });
                successLogin();
            })
            .catch((error) => {
                setError('登録に失敗しました:' + error.code + error.message);
            });
    }, [Fields, accountRef, auth, createDefaultTabs, successLogin]);

    const handleGoogleLogin = useCallback(() => {
        if (!agreeWithTerms && toggleButton === 'signIn') {
            return alert('利用規約に同意してください');
        }
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const accountDoc = await getDoc(doc(accountRef, result.user.uid));
                if (!accountDoc.exists()) {
                    const newAccount = {
                        ...defaultAccountInput,
                        email: result.user.email ?? '',
                        name: result.user.displayName ?? '',
                        icon: result.user.photoURL ?? '',
                    };
                    await setDoc(doc(accountRef, result.user.uid), newAccount);
                    createDefaultTabs({
                        id: result.user.uid,
                        ...newAccount,
                    });
                }
                successLogin();
            })
            .catch((error) => {
                setError('Googleログインに失敗しました:' + error.code + error.message);
            });
    }, [accountRef, auth, createDefaultTabs, successLogin]);

    const plainProps = {
        Fields,
        handleInputChange,
        handleLogin,
        handleSignIn,
        handleGoogleLogin,
        toggleButton,
        handleToggleButton,
        error,
        agreeWithTerms,
        setAgreeWithTerms,
    };
    return <PlainLoginPage {...plainProps} />;
};

export default LoginPage;
