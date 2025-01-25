import { BaseService } from './serviceUtils.js';
import { Methods } from '@entity/Methods.js';
export class MethodService extends BaseService<Methods> {
    constructor() {
        super(Methods, 'methods');
    }
}
