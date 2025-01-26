import { BaseService } from './serviceUtils.js';
import { Methods } from '../entities/Methods.js';

export class MethodService extends BaseService<Methods> {
    constructor() {
        super(Methods, 'methods');
    }
}
