import { Accounts } from '@entity/Accounts.js';
import { BaseService } from './serviceUtils.js';

export class AccountService extends BaseService<Accounts> {
    constructor() {
        super(Accounts, 'accounts');
    }
}
