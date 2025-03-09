import { BaseService } from './serviceUtils.js';
import { PurchaseTemplates } from '../entities/PurchaseTemplates.js';

export class PurchaseTemplateService extends BaseService<PurchaseTemplates> {
    constructor() {
        super(PurchaseTemplates, 'purchaseTemplates');
    }
}