import { AccountLinkType, AccountType } from '../types';

export const AccountToLink = (account: AccountType): AccountLinkType => {
    const { id, email, name, icon } = account;
    return { id, email, name, icon };
};
