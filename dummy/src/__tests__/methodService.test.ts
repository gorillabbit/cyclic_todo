import { getMethodsService } from '../services/methodService';
import AppDataSource from '../../../functions/db';
import { Methods } from '../../../entity/entities/Methods';
import { v4 as uuid_v4 } from 'uuid';
import { Accounts } from '../../../entity/entities/Accounts';
import { Tabs } from '../../../entity/entities/Tabs';
import { Assets } from '../../../entity/entities/Assets';

describe('getMethodsService Integration Test', () => {
    let testMethod: Methods;
    let testAccounts: Accounts;
    let testTabs: Tabs;
    let testAssets: Assets;

    beforeAll(async () => {
        try {
            // Initialize database connection
            await AppDataSource.initialize();

            // Create test data
            const methodRepository = AppDataSource.getRepository(Methods);
            const accountRepository = AppDataSource.getRepository(Accounts);
            const tabRepository = AppDataSource.getRepository(Tabs);
            const assetRepository = AppDataSource.getRepository(Assets);

            // Create test account
            testAccounts = new Accounts();
            testAccounts.id = `test-account-${uuid_v4()}`.substring(0, 20);
            testAccounts.name = 'Test Accounts';
            await accountRepository.save(testAccounts);

            // Create test tab
            testTabs = new Tabs();
            testTabs.id = `test-tab-${uuid_v4()}`.substring(0, 20);
            testTabs.name = 'Test Tabs';
            testTabs.userId = testAccounts.id;
            testTabs.createUserUid = testAccounts.id;
            await tabRepository.save(testTabs);

            testAssets = new Assets();
            testAssets.id = `test-asset-${uuid_v4()}`.substring(0, 20);
            testAssets.name = 'Test Assets';
            testAssets.userId = testAccounts.id;
            testAssets.tabId = testTabs.id;
            await assetRepository.save(testAssets);

            // Create test method
            testMethod = new Methods();
            testMethod.id = `test-method-${uuid_v4()}`.substring(0, 20);
            testMethod.timingDate = 15;
            testMethod.tabId = testTabs.id;
            testMethod.assetId = testAssets.id;
            testMethod.timing = 'monthly';
            testMethod.userId = testAccounts.id;
            testMethod.label = 'Test Method';
            await methodRepository.save(testMethod);
        } catch (error) {
            console.error('Failed to initialize test data:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            // Cleanup test data
            const methodRepository = AppDataSource.getRepository(Methods);

            if (testMethod?.id) {
                await methodRepository.delete(testMethod.id);
            }

            // Close database connection
            await AppDataSource.destroy();
        } catch (error) {
            console.error('Failed to cleanup test data:', error);
        }
    });

    it('should return empty array when no methods exist for user', async () => {
        const result = await getMethodsService({ userId: 'non-existent-user' });
        expect(result).toEqual([]);
    });

    it('should return methods for user', async () => {
        const result = await getMethodsService({ userId: testAccounts.id });
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: testMethod.id,
                    timingDate: 15,
                    tabId: testTabs.id,
                    assetId: testAssets.id,
                    timing: 'monthly',
                    userId: testAccounts.id,
                    label: 'Test Method'
                })
            ])
        );
    });

    it('should handle database errors', async () => {
        // Force database connection to close to simulate error
        await AppDataSource.destroy();

        await expect(getMethodsService({ userId: 'test-user' }))
            .rejects.toThrow();
    });
});
