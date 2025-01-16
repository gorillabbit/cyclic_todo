import AppDataSource from '../db';
import { Accounts } from '../../../entity/entities/Accounts';
import { QueryFailedError } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

interface GetAccountsParams extends Partial<Accounts> { }

interface UpdateAccountParams extends Partial<Accounts> {
    id: string;
}

interface DeleteAccountParams extends Pick<Accounts, 'id'> { }

export const getAccountsService = async ({ id }: GetAccountsParams) => {
    try {
        const accountRepository = AppDataSource.getRepository(Accounts);
        const queryBuilder = accountRepository.createQueryBuilder('account');
        if (id) {
            queryBuilder.andWhere('id = :id', { id });
        }

        return await queryBuilder.getOne();
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        console.error('Unexpected error in getAccountsService:', err);
        throw new Error('Failed to retrieve accounts');
    }
};

export const createAccountService = async ({ id, name, icon, email, ...optionalFields }: DeepPartial<Accounts>) => {
    try {
        const accountRepository = AppDataSource.getRepository(Accounts);

        const newAccount = accountRepository.create({
            id,
            name,
            icon,
            email,
            ...optionalFields
        });

        await accountRepository.save(newAccount);
        return newAccount;
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        console.error('Unexpected error in createAccountService:', err);
        throw new Error('Failed to create account');
    }
};

export const updateAccountService = async ({ id, ...updateFields }: UpdateAccountParams) => {
    try {
        const accountRepository = AppDataSource.getRepository(Accounts);

        const updateData: Partial<Accounts> = {};

        // Only include fields that are actually being updated
        if (updateFields.name !== undefined) updateData.name = updateFields.name;
        if (updateFields.icon !== undefined) updateData.icon = updateFields.icon;
        if (updateFields.email !== undefined) updateData.email = updateFields.email;
        if (updateFields.receiveRequest !== undefined) updateData.receiveRequest = updateFields.receiveRequest;
        if (updateFields.linkedAccounts !== undefined) updateData.linkedAccounts = updateFields.linkedAccounts;
        if (updateFields.sendRequest !== undefined) updateData.sendRequest = updateFields.sendRequest;
        if (updateFields.useTabIds !== undefined) updateData.useTabIds = updateFields.useTabIds;

        await accountRepository.update(id, updateData);
        return await accountRepository.findOneBy({ id });
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        console.error('Unexpected error in updateAccountService:', err);
        throw new Error('Failed to update account');
    }
};

export const deleteAccountService = async ({ id }: DeleteAccountParams) => {
    try {
        const accountRepository = AppDataSource.getRepository(Accounts);
        const result = await accountRepository.delete(id);

        if (result.affected === 0) {
            throw new Error('Account not found');
        }

        return { success: true };
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        console.error('Unexpected error in deleteAccountService:', err);
        throw new Error('Failed to delete account');
    }
};
