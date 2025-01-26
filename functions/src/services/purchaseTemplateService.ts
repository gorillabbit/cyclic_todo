import { DeepPartial, EntityManager } from 'typeorm';
import AppDataSource from '../db.js';
import { BaseService } from './serviceUtils.js';
import { PurchaseTemplates } from '../entities/PurchaseTemplates.js';

export class PurchaseTemplateService extends BaseService<PurchaseTemplates> {
    constructor() {
        super(PurchaseTemplates, 'purchaseTemplates');
    }

    override async create(
        entityData: DeepPartial<PurchaseTemplates>
    ): Promise<PurchaseTemplates> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(PurchaseTemplates);
            const newTemplate = repo.create(entityData);
            return await repo.save(newTemplate);
        });
    }

    override async update(
        id: string,
        updateData: DeepPartial<PurchaseTemplates>
    ): Promise<PurchaseTemplates> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(PurchaseTemplates);
            const existing = await repo.findOne({ where: { id } });
            if (!existing) throw new Error('Purchase template not found');
            const merged = repo.merge(existing, updateData);
            return await repo.save(merged);
        });
    }
}