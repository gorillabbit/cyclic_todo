import {
    QueryFailedError,
    Repository,
    DeepPartial,
    ObjectLiteral,
    EntityTarget,
    EntityManager
} from 'typeorm';
import AppDataSource from '../db.js';

// カスタムエラークラスを追加
class DatabaseError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'DatabaseError';
    }
}

class AppError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'AppError';
    }
}

export abstract class BaseService<T extends ObjectLiteral> {
    protected repository: Repository<T>;
    protected entityName: string;

    constructor(entity: EntityTarget<T>, entityName: string) {
        this.repository = AppDataSource.getRepository<T>(entity);
        this.entityName = entityName;
    }

    protected async handleError(methodName: string, err: unknown): Promise<never> {
        if (err instanceof QueryFailedError) {
            const errorMessage = `Database error in ${methodName}: ${err.message}`;
            console.error(errorMessage);
            throw new DatabaseError(errorMessage, { cause: err });
        }
        
        const errorMessage = `Unexpected error in ${methodName}: ${err instanceof Error 
            ? err.message : 'Unknown error'}`;
        console.error(errorMessage);
        throw new AppError(errorMessage, { cause: err });
    }

    async getAll(
        filters: Record<string, unknown> = {},
        order: Record<string, 'ASC' | 'DESC'> = {}
    ): Promise<T[]> {
        try {
            const queryBuilder = this.repository.createQueryBuilder(this.entityName);
      
            // 同じキーで複数値がある場合はOR条件で処理
            for (const [key, value] of Object.entries(filters)) {
                if (Array.isArray(value)) {
                    const columnName = key;
                    const paramName = `:...${key}`;
                    const condition = `${columnName} IN (${paramName})`;
                    const parameters = { [key]: value };
                    
                    queryBuilder.andWhere(
                        condition,
                        parameters
                    );
                } else if (typeof value === 'string' && value.includes(',')) {
                    const values = value.split(',').map(v => v.trim());
                    queryBuilder.andWhere(`${key} IN (:...${key})`, { [key]: values });
                } else {
                    queryBuilder.andWhere(`${key} = :${key}`, { [key]: value });
                }
            }

            for (const [field, direction] of Object.entries(order)) {
                queryBuilder.addOrderBy(`${field}`, direction);
            }

            return await queryBuilder.getMany();
        } catch (err) {
            return this.handleError('getAll', err);
        }
    }

    async create(entityData: DeepPartial<T>): Promise<T> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            try {
                const repo = manager.getRepository<T>(this.repository.target);
                const newEntity = repo.create(entityData);
                return await repo.save(newEntity);
            } catch (err) {
                return this.handleError('create', err);
            }
        });
    }

    async update(id: string, updateData: DeepPartial<T>): Promise<T> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            try {
                const repo = manager.getRepository<T>(this.repository.target);
                const existing = await repo.findOne({ where: { id } } as unknown as T);
                if (!existing) throw new Error('Entity not found');
                
                const merged = repo.merge(existing, updateData);
                return await repo.save(merged);
            } catch (err) {
                return this.handleError('update', err);
            }
        });
    }

    async delete(id: string): Promise<void> {
        try {
            const result = await this.repository.delete(id);
            if (result.affected === 0) {
                throw new Error('Entity not found');
            }
        } catch (err) {
            return this.handleError('delete', err);
        }
    }
}
