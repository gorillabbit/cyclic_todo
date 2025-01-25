import AppDataSource from '../../../functions/db';
import { Assets } from '../../../entity/entities/Assets';
import { QueryFailedError } from 'typeorm';

interface GetAssetsParams {
    user_id?: string;
    asset_id?: string;
}

export const getAssetsService = async ({ user_id, asset_id }: GetAssetsParams) => {
    try {
        const assetRepository = AppDataSource.getRepository(Assets);
        const queryBuilder = assetRepository.createQueryBuilder('asset');

        if (user_id) {
            queryBuilder.andWhere('user_id = :user_id', { user_id });
        }

        if (asset_id) {
            queryBuilder.andWhere('id = :asset_id', { asset_id });
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
