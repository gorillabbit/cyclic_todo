import { getAssetsService } from '../services/assetService';
import AppDataSource from '../db';
import { Assets } from '../../../entity/entities/Assets';
import { v4 as uuid_v4 } from 'uuid';
import { Accounts } from '../../../entity/entities/Accounts';
import { Tabs } from '../../../entity/entities/Tabs';

describe('getAssetsService Integration Test', () => {
    let testAsset: Assets;
    let testAccounts: Accounts;
    let testTabs: Tabs;

    beforeAll(async () => {
        try {
            // Initialize database connection
            await AppDataSource.initialize();

            // Create test data
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


            // Create test asset
            testAsset = new Assets();
            testAsset.id = `test-asset-${uuid_v4()}`.substring(0, 20);
            testAsset.name = 'Test Asset';
            testAsset.userId = testAccounts.id;
            testAsset.tabId = testTabs.id;
            await assetRepository.save(testAsset);
        } catch (error) {
            console.error('Failed to initialize test data:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            // Cleanup test data
            const assetRepository = AppDataSource.getRepository(Assets);

            if (testAsset?.id) {
                await assetRepository.delete(testAsset.id);
            }

            // Close database connection
            await AppDataSource.destroy();
        } catch (error) {
            console.error('Failed to cleanup test data:', error);
        }
    });

    it('should return empty array when no assets exist for user', async () => {
        const result = await getAssetsService({ userId: 'non-existent-user' });
        expect(result).toEqual([]);
    });

    it('should return assets for user', async () => {
        const result = await getAssetsService({ userId: testAccounts.id });
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: testAsset.id,
                    name: 'Test Asset',
                    userId: testAccounts.id,
                    tabId: testTabs.id
                })
            ])
        );
    });

    it('should handle database errors', async () => {
        // Force database connection to close to simulate error
        await AppDataSource.destroy();

        await expect(getAssetsService({ userId: 'test-user' }))
            .rejects.toThrow();
    });
});
