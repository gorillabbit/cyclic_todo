import {
    QueryFailedError,
    Repository,
    DeepPartial,
    ObjectLiteral,
    EntityTarget
} from 'typeorm';
import AppDataSource from '../db.js';

export abstract class BaseService<T extends ObjectLiteral> {
    protected repository: Repository<T>;

    constructor(entity: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository<T>(entity as EntityTarget<T>);
    }

    protected async handleError(methodName: string, err: unknown): Promise<never> {
        if (err instanceof QueryFailedError) {
            console.error(`${methodName} でDB操作に失敗しました:`, err.message);
            throw new Error(err.message);
        }
        throw err;
    }

    async getAll(
        filters: Record<string, unknown> = {},
        order: Record<string, 'ASC' | 'DESC'> = {}
    ): Promise<T[]> {
        try {
            const entityName = this.getEntityName();
            const queryBuilder = this.repository.createQueryBuilder(entityName.toLowerCase());
      
            for (const [key, value] of Object.entries(filters)) {
                queryBuilder.andWhere(`${key} = :value`, { value });
            }

            for (const [field, direction] of Object.entries(order)) {
                queryBuilder.addOrderBy(`${field}`, direction);
            }

            return await queryBuilder.getMany();
        } catch (err) {
            return this.handleError('getAll', err);
        }
    }

    private getEntityName(): string {
        const target = this.repository.metadata.target;
        
        if (typeof target === 'function') {
            return (target as Function).name;
        }
        
        if (typeof target === 'string') {
            return target;
        }
        
        throw new Error('Unsupported entity type');
    }

    async create(entityData: DeepPartial<T>): Promise<T> {
        try {
            const newEntity = this.repository.create(entityData as DeepPartial<T>);
            return await this.repository.save(newEntity);
        } catch (err) {
            return this.handleError('create', err);
        }
    }

    async update(id: string, updateData: DeepPartial<T>): Promise<T> {
        try {
            const existing = await this.repository.findOneBy({ id } as object);
            if (!existing) throw new Error('Entity not found');
      
            const merged = this.repository.merge(existing, updateData);
            return await this.repository.save(merged);
        } catch (err) {
            return this.handleError('update', err);
        }
    }
}
