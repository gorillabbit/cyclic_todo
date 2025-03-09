import { ReactNode } from 'react';
import { AccountType } from '../../types';
import { useAccountStore } from '../../stores/accountStore';

interface AccountContextProp {
    Account: AccountType | undefined;
    children: ReactNode;
}

export const AccountProvider: React.FC<AccountContextProp> = ({ Account, children }) => {
    const { setAccount } = useAccountStore();
    // Accountがundefinedの場合のみ、setAccountを実行
    if (Account) {
        setAccount(Account);
    }
    return <>{children}</>;
};
