import { BaseService } from './serviceUtils.js';
import { TransferTemplates } from '../entities/TransferTemplates.js';

export class TransferTemplateService extends BaseService<TransferTemplates> {
    constructor() {
        super(TransferTemplates, 'transfer_templates');
    }
}
