import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { memo, useCallback, useState } from "react";
import { app, db } from "../firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { defaultAccountInput } from "../types";

type PlainLoginPageProps = {
  Fields: {
    email: string;
    password: string;
    name: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  handleLogin: () => void;
  handleSignin: () => void;
  handleGoogleLogin: () => void;
  toggleButton: string;
  handleToggleButton: (value: string) => void;
  error: string;
};

const PlainLoginPage = memo(
  ({
    Fields,
    handleInputChange,
    handleLogin,
    handleSignin,
    handleGoogleLogin,
    toggleButton,
    handleToggleButton,
    error,
  }: PlainLoginPageProps) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        m={1}
        gap={1}
      >
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
        {toggleButton === "signIn" && (
          <TextField
            label="表示名"
            name="name"
            value={Fields.name}
            onChange={handleInputChange}
          />
        )}
        {error && <Box color="red">{error}</Box>}
        {toggleButton === "login" && (
          <Button onClick={handleLogin}>ログイン</Button>
        )}
        {toggleButton === "signIn" && (
          <Button onClick={handleSignin}>新規登録</Button>
        )}
        <Button onClick={handleGoogleLogin}>Googleでログイン</Button>
      </Box>
    );
  }
);

const LoginPage = () => {
  const [toggleButton, setToggleButton] = useState<string>("login");
  const [Fields, setFields] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState<string>("");
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value, name } = e.target;
      setFields((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const successLogin = useCallback(() => {
    setError("");
    navigate("/");
  }, [navigate]);

  const handleToggleButton = useCallback((value: string) => {
    if (value !== null) {
      setToggleButton(value);
    }
  }, []);

  const handleLogin = useCallback(() => {
    if (!Fields.email || !Fields.password) {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }
    signInWithEmailAndPassword(auth, Fields.email, Fields.password)
      .then(() => {
        successLogin();
      })
      .catch((error) => {
        setError("ログインに失敗しました:" + error.code + error.message);
      });
  }, [Fields.email, Fields.password, auth, successLogin]);

  const accountRef = collection(db, "Accounts");
  const handleSignin = useCallback(() => {
    if (!Fields.email || !Fields.password) {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }
    createUserWithEmailAndPassword(auth, Fields.email, Fields.password)
      .then(async (userCredential) => {
        await setDoc(doc(accountRef, userCredential.user.uid), {
          ...defaultAccountInput,
          email: Fields.email,
          name: Fields.name,
        });
        successLogin();
      })
      .catch((error) => {
        setError("登録に失敗しました:" + error.code + error.message);
      });
  }, [
    Fields.email,
    Fields.name,
    Fields.password,
    accountRef,
    auth,
    successLogin,
  ]);

  const handleGoogleLogin = useCallback(() => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const accountDoc = await getDoc(doc(accountRef, result.user.uid));
        if (!accountDoc.exists()) {
          await setDoc(doc(accountRef, result.user.uid), {
            ...defaultAccountInput,
            email: result.user.email ?? "",
            name: result.user.displayName ?? "",
            icon: result.user.photoURL ?? "",
          });
        }
        successLogin();
      })
      .catch((error) => {
        setError("Googleログインに失敗しました:" + error.code + error.message);
      });
  }, [accountRef, auth, successLogin]);

  const plainProps = {
    Fields,
    handleInputChange,
    handleLogin,
    handleSignin,
    handleGoogleLogin,
    toggleButton,
    handleToggleButton,
    error,
  };
  return <PlainLoginPage {...plainProps} />;
};

export default LoginPage;
