import { BaseService } from './serviceUtils.js';
import { Accounts } from '../../../entity/entities/Accounts.js';

export class AccountService extends BaseService<Accounts> {
    constructor() {
        super(Accounts, 'accounts');
    }
}
