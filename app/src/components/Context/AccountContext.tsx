import { createContext } from 'react';
import { AccountType, defaultAccount } from '../../types';

interface AccountContextProp {
    Account: AccountType | undefined;
    children: React.ReactNode;
}

export type AccountContextType = {
    Account: AccountType | undefined;
};

export const AccountContext = createContext<AccountContextType>({
    Account: defaultAccount,
});

export const AccountProvider: React.FC<AccountContextProp> = ({ Account, children }) => {
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
