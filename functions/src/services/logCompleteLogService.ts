import { BaseService } from './serviceUtils.js';
import { LogsCompleteLogs } from '../entities/LogsCompleteLogs.js';

export class LogsCompleteLogService extends BaseService<LogsCompleteLogs> {
    constructor() {
        super(LogsCompleteLogs, 'logs_complete_logs');
    }
}
