import { DeepPartial, EntityManager } from 'typeorm';
import AppDataSource from '../db.js';
import { BaseService } from './serviceUtils.js';
import { Logs } from '../../../entity/entities/Logs.js';

export class LogService extends BaseService<Logs> {
    constructor() {
        super(Logs, 'logs');
    }

    override async create(entityData: DeepPartial<Logs>): Promise<Logs> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Logs);
            const newLog = repo.create(entityData);
            return await repo.save(newLog);
        });
    }

    override async update(id: string, updateData: DeepPartial<Logs>): Promise<Logs> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Logs);
            const existing = await repo.findOne({ where: { id } });
            if (!existing) throw new Error('Log not found');
            const merged = repo.merge(existing, updateData);
            return await repo.save(merged);
        });
    }
}
