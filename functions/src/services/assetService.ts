import { DeepPartial, EntityManager } from 'typeorm';
import AppDataSource from '../db.js';
import { BaseService } from './serviceUtils.js';
import { Assets } from '../../../entity/entities/Assets.js';

export class AssetService extends BaseService<Assets> {
    constructor() {
        super(Assets, 'assets');
    }

    override async create(entityData: DeepPartial<Assets>): Promise<Assets> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Assets);
            const newAsset = repo.create(entityData);
            return await repo.save(newAsset);
        });
    }

    override async update(id: string, updateData: DeepPartial<Assets>): Promise<Assets> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Assets);
            const existing = await repo.findOne({ where: { id } });
            if (!existing) throw new Error('Asset not found');
            const merged = repo.merge(existing, updateData);
            return await repo.save(merged);
        });
    }
}
