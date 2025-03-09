import { BaseService } from './serviceUtils.js';
import { PurchaseSchedules } from '../entities/PurchaseSchedules.js';

export class PurchaseScheduleService extends BaseService<PurchaseSchedules> {
    constructor() {
        super(PurchaseSchedules, 'purchaseSchedules');
    }
}