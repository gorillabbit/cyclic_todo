import AppDataSource from '../../../functions/db';
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
        if (updateFields.receive_request !== undefined) updateData.receive_request = updateFields.receive_request;
        if (updateFields.linked_accounts !== undefined) updateData.linked_accounts = updateFields.linked_accounts;
        if (updateFields.send_request !== undefined) updateData.send_request = updateFields.send_request;
        if (updateFields.use_tab_ids !== undefined) updateData.use_tab_ids = updateFields.use_tab_ids;

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
