import { Assets } from '../../../entity/entities/Assets.js';
import * as functions from 'firebase-functions';
import { BaseService } from './serviceUtils.js';

class AssetService extends BaseService<Assets> {
    constructor() {
        super(Assets, 'assets');
    }
}

const methodService = new AssetService();

export const getAssets = functions.https.onCall(async (request) => {
    const { userId, tabId } = request.data;
    return await methodService.getAll({ user_id: userId, tab_id: tabId });
});

export const createAsset = functions.https.onCall(async (request) => {
    return await methodService.create(request.data);
});

export const updateAsset = functions.https.onCall(async (request) => {
    const { purchaseId, updateData } = request.data;
    return await methodService.update(purchaseId, updateData);
});
