import { DeepPartial, EntityManager } from 'typeorm';
import AppDataSource from '../db.js';
import { BaseService } from './serviceUtils.js';
import { Tabs } from '../entities/Tabs.js';

export class TabService extends BaseService<Tabs> {
    constructor() {
        super(Tabs, 'tabs');
    }

    override async create(entityData: DeepPartial<Tabs>): Promise<Tabs> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Tabs);
            const newTab = repo.create(entityData);
            return await repo.save(newTab);
        });
    }

    override async update(id: string, updateData: DeepPartial<Tabs>): Promise<Tabs> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Tabs);
            const existing = await repo.findOne({ where: { id } });
            if (!existing) throw new Error('Tab not found');
            const merged = repo.merge(existing, updateData);
            return await repo.save(merged);
        });
    }
}
