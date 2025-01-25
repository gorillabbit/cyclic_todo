import { Assets } from '../../../entity/entities/Assets.js';
import { BaseService } from './serviceUtils.js';


export class AssetService extends BaseService<Assets> {
    constructor() {
        super(Assets, 'assets');
    }
}
