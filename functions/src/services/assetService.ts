import { BaseService } from './serviceUtils.js';
import { Assets } from '@entity/Assets.js';

export class AssetService extends BaseService<Assets> {
    constructor() {
        super(Assets, 'assets');
    }
}
