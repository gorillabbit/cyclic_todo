import AppDataSource from '../db';
import { Tabs } from '../../../entity/entities/Tabs';
import { QueryFailedError } from 'typeorm';

interface GetTabsParams {
    userId?: string;
    tabId?: string;
}

export const getTabsService = async ({ userId, tabId }: GetTabsParams) => {
    try {
        const tabRepository = AppDataSource.getRepository(Tabs);
        const queryBuilder = tabRepository.createQueryBuilder('tab');

        if (userId) {
            queryBuilder.andWhere('user_id = :userId', { userId });
        }

        if (tabId) {
            queryBuilder.andWhere('id = :tabId', { tabId });
        }

        return await queryBuilder
            .getMany();
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        console.error('Unexpected error in getTabsService:', err);
        throw new Error('Failed to retrieve tabs');
    }
};
