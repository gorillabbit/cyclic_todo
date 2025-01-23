import { Methods } from '../../../entity/entities/Methods.js';
import * as functions from 'firebase-functions';
import { BaseService } from './serviceUtils.js';

class MethodService extends BaseService<Methods> {
    constructor() {
        super(Methods, 'methods');
    }
}

const methodService = new MethodService();

export const getMethods = functions.https.onCall(async (request) => {
    const { userId, tabId } = request.data;
    return await methodService.getAll({ user_id: userId, tab_id: tabId });
});

export const createMethod = functions.https.onCall(async (request) => {
    return await methodService.create(request.data);
});

export const updateMethod = functions.https.onCall(async (request) => {
    const { purchaseId, updateData } = request.data;
    return await methodService.update(purchaseId, updateData);
});
