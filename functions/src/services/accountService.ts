import { Accounts } from '../../../entity/entities/Accounts.js';
import { QueryFailedError } from 'typeorm';
import AppDataSource from '../db.js';
import * as functions from 'firebase-functions';

interface GetAccountsParams {
    userId?: string;
}

export const getAccountsService = async ({
    userId,
}: GetAccountsParams): Promise<Accounts[]> => {
    try {
        const purchaseRepository = AppDataSource.getRepository(Accounts);
        const queryBuilder = purchaseRepository.createQueryBuilder('purchase');

        if (userId) {
            queryBuilder.andWhere(`user_id = "${userId}"`);
        }

        return await queryBuilder.getMany();
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        throw err;
    }
};

export const getAccounts = functions.https.onCall(async (request) => {
    const { userId } = request.data;
    return await getAccountsService({ userId });
});
