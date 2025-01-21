import { Purchases } from '../../../entity/entities/Purchases.js';
import { QueryFailedError } from 'typeorm';
import AppDataSource from '../db.js';
import * as functions from 'firebase-functions';

interface GetPurchasesParams {
    userId?: string;
    tabId?: string;
}

export const getPurchasesService = async ({ userId, tabId }: GetPurchasesParams) => {
    try {
        const purchaseRepository = AppDataSource.getRepository(Purchases);
        const queryBuilder = purchaseRepository.createQueryBuilder('purchase');

        if (userId) {
            queryBuilder.andWhere(`user_id = "${userId}"`,);
        }

        if (tabId) {
            queryBuilder.andWhere(`tab_id = "${tabId}"`,);
        }

        return await queryBuilder
            .orderBy('date', 'DESC')
            .addOrderBy('timestamp', 'DESC')
            .getMany();
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        throw err;
    }
};

export const getPurchases = functions.https.onCall(async (request) => {
    const { userId, tabId } = request.data;
    return await getPurchasesService({ userId, tabId });
});
