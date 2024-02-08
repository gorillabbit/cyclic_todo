import { createContext, useState, useContext, useEffect } from "react";
import { db } from "../../firebase.js";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { AccountType } from "../../types.js";
import { getAuth } from "firebase/auth";

interface AccountContextProp {
  children: any;
}

type AccountContextType = {
  Account: AccountType | undefined;
};

// Contextを作成（初期値は空のAccountListとダミーのsetAccountList関数）
export const AccountContext = createContext<AccountContextType>({
  Account: {
    uid: "",
    email: "",
    name: "",
    linkedAccounts: [],
  },
});

export const AccountProvider: React.FC<AccountContextProp> = ({ children }) => {
  const [Account, setAccount] = useState<AccountType>();
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    //Accountの取得
    const fetchAccounts = () => {
      const AccountQuery = query(
        collection(db, "Accounts"),
        where("uid", "==", auth.currentUser?.uid)
      );
      return onSnapshot(AccountQuery, (querySnapshot) => {
        const AccountsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as AccountType),
        }));
        setAccount(AccountsData[0]);
      });
    };

    const unsubscribeAccount = fetchAccounts();

    // コンポーネントがアンマウントされるときに購読を解除
    return () => {
      unsubscribeAccount();
    };
  }, [auth.currentUser]);

  return (
    <AccountContext.Provider
      value={{
        Account: Account,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
