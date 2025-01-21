import { getPurchases } from '../services/purchaseService.js';
import * as functions from 'firebase-functions';
import firebaseTest from 'firebase-functions-test';

const testEnv = firebaseTest();

function createTestRequest(data: any): functions.https.CallableRequest {
    return {
        data,
        rawRequest: {} as any,
        acceptsStreaming: false
    };
}

describe('getPurchases', () => {
    afterAll(() => {
        testEnv.cleanup();
    });

    it('should return purchases for a user', async () => {
        const wrapped = testEnv.wrap(getPurchases);
        const testData = createTestRequest({
            userId: 'test-user-id',
            tabId: 'test-tab-id'
        });

        const result = await wrapped(testData);

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty parameters', async () => {
        const wrapped = testEnv.wrap(getPurchases);
        const testData = createTestRequest({});

        const result = await wrapped(testData);

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle database errors', async () => {
        const wrapped = testEnv.wrap(getPurchases);
        const testData = createTestRequest({
            userId: 'error-user-id'
        });

        await expect(wrapped(testData)).rejects.toThrow('Database operation failed');
    });
});
