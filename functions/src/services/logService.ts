import { BaseService } from './serviceUtils.js';
import { Logs } from '../entities/Logs.js';

export class LogService extends BaseService<Logs> {
    constructor() {
        super(Logs, 'logs');
    }
    async getSharedLogs(
        tabId: string,
        userId: string,
    ): Promise<Logs[]> {
        try {
            const queryBuilder = this.repository.createQueryBuilder(this.entityName);
            queryBuilder.where('logs.tabId = :tabId', { tabId });

            queryBuilder.andWhere('logs.userId != :userId', { userId });

            queryBuilder.andWhere(
                'logs.accessibleAccountsEmails IN (:...userId)', { userId });

            queryBuilder.addOrderBy('createdAt', 'DESC');   
            return await queryBuilder.getMany();
        } catch (err) {
            return this.handleError('getSharedLogs', err);
        }
    }
}
