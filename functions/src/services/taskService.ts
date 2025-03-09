import AppDataSource from '../db.js';
import { BaseService } from './serviceUtils.js';
import { Tasks } from '../entities/Tasks.js';

export class TaskService extends BaseService<Tasks> {
    constructor() {
        super(Tasks, 'tasks');
    }

    async getUnassigned(query: any): Promise<Tasks[]> {
        const repo = AppDataSource.getRepository(Tasks);
        return repo.find({ where: { assignedTo: null }, ...query });
    }
}
