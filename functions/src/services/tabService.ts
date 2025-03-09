import { BaseService } from './serviceUtils.js';
import { Tabs } from '../entities/Tabs.js';

export class TabService extends BaseService<Tabs> {
    constructor() {
        super(Tabs, 'tabs');
    }
}
