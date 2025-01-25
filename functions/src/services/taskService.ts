import { DeepPartial, EntityManager } from 'typeorm';
import AppDataSource from '../db.js';
import { BaseService } from './serviceUtils.js';
import { Tasks } from '../../../entity/entities/Tasks.js';

export class TaskService extends BaseService<Tasks> {
    constructor() {
        super(Tasks, 'tasks');
    }

    override async create(entityData: DeepPartial<Tasks>): Promise<Tasks> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Tasks);
            const newTask = repo.create(entityData);
            return await repo.save(newTask);
        });
    }

    async getUnassigned(query: any): Promise<Tasks[]> {
        const repo = AppDataSource.getRepository(Tasks);
        return repo.find({ where: { assignedTo: null }, ...query });
    }

    override async update(id: string, updateData: DeepPartial<Tasks>): Promise<Tasks> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Tasks);
            const existing = await repo.findOne({ where: { id } });
            if (!existing) throw new Error('Task not found');
            const merged = repo.merge(existing, updateData);
            return await repo.save(merged);
        });
    }
}
