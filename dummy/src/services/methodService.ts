import AppDataSource from '../../../functions/db';
import { Methods } from '../../../entity/entities/Methods';
import { QueryFailedError } from 'typeorm';

interface GetMethodsParams {
    user_id?: string;
    methodId?: string;
}

export const getMethodsService = async ({ user_id, methodId }: GetMethodsParams) => {
    try {
        const methodRepository = AppDataSource.getRepository(Methods);
        const queryBuilder = methodRepository.createQueryBuilder('method');

        if (user_id) {
            queryBuilder.andWhere('user_id = :user_id', { user_id });
        }

        if (methodId) {
            queryBuilder.andWhere('id = :methodId', { methodId });
        }

        return await queryBuilder
            .getMany();
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        console.error('Unexpected error in getMethodsService:', err);
        throw new Error('Failed to retrieve methods');
    }
};
