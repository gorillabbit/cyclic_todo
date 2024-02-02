import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { app } from "../firebase";
import { useEffect, useState } from "react";
import { Avatar, Button, Chip } from "@mui/material";

interface SignInWithGoogleProp {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const SignInWithGoogle: React.FC<SignInWithGoogleProp> = ({ setUser }) => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [userAccount, setUserAccount] = useState<User>();

  const signIn = () => {
    signInWithPopup(auth, provider).catch((error) => {
      // エラー処理
      console.error("Error signing in with Google: ", error);
    });
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        userAccount ?? setUserAccount(user);
      } else {
        // ユーザーがログアウトしている場合の処理
      }
    });

    // クリーンアップ関数
    return () => unsubscribe();
  }, [userAccount]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserAccount(undefined);
        setUser(undefined);
      })
      .catch((error) => {
        // エラー処理
        console.error("ログアウト中にエラーが発生しました:", error);
      });
  };

  return userAccount ? (
    <Chip
      label={userAccount.displayName}
      avatar={<Avatar src={userAccount.photoURL ?? ""} alt="アイコン" />}
      onDelete={handleLogout}
    />
  ) : (
    <Button variant="contained" onClick={signIn}>
      Sign In
    </Button>
  );
};

export default SignInWithGoogle;
