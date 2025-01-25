import { DeepPartial, EntityManager } from 'typeorm';
import AppDataSource from '../db.js';
import { BaseService } from './serviceUtils.js';
import { Accounts } from '../../../entity/entities/Accounts.js';

export class AccountService extends BaseService<Accounts> {
    constructor() {
        super(Accounts, 'accounts');
    }

    override async create(entityData: DeepPartial<Accounts>): Promise<Accounts> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Accounts);
            const newAccount = repo.create(entityData);
            return await repo.save(newAccount);
        });
    }

    override async update(id: string, updateData: DeepPartial<Accounts>): Promise<Accounts> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Accounts);
            const existing = await repo.findOne({ where: { id } });
            if (!existing) throw new Error('Account not found');
            const merged = repo.merge(existing, updateData);
            return await repo.save(merged);
        });
    }
}
