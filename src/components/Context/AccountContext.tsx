import { createContext, useContext } from "react";
import { AccountType } from "../../types";

interface AccountContextProp {
  Account: AccountType | undefined;
  children: any;
}

type AccountContextType = {
  Account: AccountType | undefined;
};

export const AccountContext = createContext<AccountContextType>({
  Account: {
    id: "",
    uid: "",
    email: "",
    name: "",
    icon: "",
    linkedAccounts: [],
  },
});

export const AccountProvider: React.FC<AccountContextProp> = ({
  Account,
  children,
}) => {
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
