import AppDataSource from '../../../functions/db';
import { Tabs } from '../../../entity/entities/Tabs';
import { DeepPartial, QueryFailedError } from 'typeorm';

interface GetTabsParams extends Partial<Tabs> { }
interface UpdateTabParams extends Partial<Tabs> {
    id: string;
}

interface DeleteTabParams extends Pick<Tabs, 'id'> { }

export const getTabsService = async ({ userId, id }: GetTabsParams) => {
    try {
        const tabRepository = AppDataSource.getRepository(Tabs);
        const queryBuilder = tabRepository.createQueryBuilder('tab');

        if (userId) {
            queryBuilder.andWhere('user_id = :userId', { userId });
        }

        if (id) {
            queryBuilder.andWhere('id = :id', { id });
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

export const createTabService = async ({ id, name, userId, createUserUid, ...optionalFields }: DeepPartial<Tabs>) => {
    try {
        const tabRepository = AppDataSource.getRepository(Tabs);

        const newTab = tabRepository.create({
            id,
            name,
            userId,
            createUserUid,
            ...optionalFields
        });

        await tabRepository.save(newTab);
        return newTab;
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        console.error('Unexpected error in createTabService:', err);
        throw new Error('Failed to create tab');
    }
};

export const updateTabService = async ({ id, ...updateFields }: UpdateTabParams) => {
    try {
        const tabRepository = AppDataSource.getRepository(Tabs);

        const updateData: Partial<Tabs> = {};

        // Only include fields that are actually being updated
        if (updateFields.name !== undefined) updateData.name = updateFields.name;

        await tabRepository.update(id, updateData);
        return await tabRepository.findOneBy({ id });
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        console.error('Unexpected error in updateTabService:', err);
        throw new Error('Failed to update tab');
    }
};

export const deleteTabService = async ({ id }: DeleteTabParams) => {
    try {
        const tabRepository = AppDataSource.getRepository(Tabs);
        const result = await tabRepository.delete(id);

        if (result.affected === 0) {
            throw new Error('Tab not found');
        }

        return { success: true };
    } catch (err) {
        if (err instanceof QueryFailedError) {
            console.error('Database query failed:', err.message);
            throw new Error('Database operation failed');
        }
        console.error('Unexpected error in deleteTabService:', err);
        throw new Error('Failed to delete tab');
    }
};
