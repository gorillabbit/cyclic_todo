import { DeepPartial, EntityManager } from 'typeorm';
import AppDataSource from '../db.js';
import { BaseService } from './serviceUtils.js';
import { PurchaseSchedules } from '../entities/PurchaseSchedules.js';

export class PurchaseScheduleService extends BaseService<PurchaseSchedules> {
    constructor() {
        super(PurchaseSchedules, 'purchaseSchedules');
    }

    override async create(
        entityData: DeepPartial<PurchaseSchedules>
    ): Promise<PurchaseSchedules> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(PurchaseSchedules);
            const newSchedule = repo.create(entityData);
            return await repo.save(newSchedule);
        });
    }

    override async update(
        id: string,
        updateData: DeepPartial<PurchaseSchedules>
    ): Promise<PurchaseSchedules> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(PurchaseSchedules);
            const existing = await repo.findOne({ where: { id } });
            if (!existing) throw new Error('Purchase schedule not found');
            const merged = repo.merge(existing, updateData);
            return await repo.save(merged);
        });
    }
}