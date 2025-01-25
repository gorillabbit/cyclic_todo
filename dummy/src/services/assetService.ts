import AppDataSource from '../../../functions/db';
import { Assets } from '../../../entity/entities/Assets';
import { QueryFailedError } from 'typeorm';

interface GetAssetsParams {
    userId?: string;
    assetId?: string;
}

export const getAssetsService = async ({ userId, assetId }: GetAssetsParams) => {
    try {
        const assetRepository = AppDataSource.getRepository(Assets);
        const queryBuilder = assetRepository.createQueryBuilder('asset');

        if (userId) {
            queryBuilder.andWhere('user_id = :userId', { userId });
        }

        if (assetId) {
            queryBuilder.andWhere('id = :assetId', { assetId });
        }

        return await queryBuilder
            .getMany();
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        console.error('Unexpected error in getAssetsService:', err);
        throw new Error('Failed to retrieve assets');
    }
};
