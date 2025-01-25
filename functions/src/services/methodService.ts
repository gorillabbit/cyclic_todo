import { DeepPartial, EntityManager } from 'typeorm';
import AppDataSource from '../db.js';
import { BaseService } from './serviceUtils.js';
import { Methods } from '../../../entity/entities/Methods.js';

export class MethodService extends BaseService<Methods> {
    constructor() {
        super(Methods, 'methods');
    }

    override async create(entityData: DeepPartial<Methods>): Promise<Methods> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Methods);
            const newMethod = repo.create(entityData);
            return await repo.save(newMethod);
        });
    }

    override async update(id: string, updateData: DeepPartial<Methods>): Promise<Methods> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Methods);
            const existing = await repo.findOne({ where: { id } });
            if (!existing) throw new Error('Method not found');
            const merged = repo.merge(existing, updateData);
            return await repo.save(merged);
        });
    }
}
