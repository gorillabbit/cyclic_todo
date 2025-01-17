import AppDataSource from '../db';
import { Accounts } from '../../../entity/entities/Accounts';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { errorQueryHandler } from './serviceUtils';

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
        return errorQueryHandler(err, 'getAccountsService');
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
        return errorQueryHandler(err, 'createAccountService');
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
        return errorQueryHandler(err, 'updateAccountService');
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
        return errorQueryHandler(err, 'deleteAccountService');
    }
};
