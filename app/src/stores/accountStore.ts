import { create } from 'zustand';
import { AccountType, defaultAccount } from '../types';

type AccountState = {
    Account: AccountType | undefined;
    setAccount: (account: AccountType | undefined) => void;
};

export const useAccountStore = create<AccountState>((set) => ({
    Account: defaultAccount,
    setAccount: (account: AccountType | undefined): void => set({ Account: account }),
}));
