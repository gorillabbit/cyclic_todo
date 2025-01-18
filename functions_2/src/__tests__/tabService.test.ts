import { getTabsService } from '../services/tabService';
import AppDataSource from '../../../functions/db';
import { Tabs } from '../../../entity/entities/Tabs';
import { Accounts } from '../../../entity/entities/Accounts';
import { v4 as uuid_v4 } from 'uuid';

describe('getTabsService Integration Test', () => {
    let testTab: Tabs;
    let testAccounts: Accounts;

    beforeAll(async () => {
        try {
            // Initialize database connection
            await AppDataSource.initialize();

            // Create test data
            const accountRepository = AppDataSource.getRepository(Accounts);
            const tabRepository = AppDataSource.getRepository(Tabs);

            // Create test account
            testAccounts = new Accounts();
            testAccounts.id = `test-account-${uuid_v4()}`.substring(0, 20);
            testAccounts.name = 'Test Accounts';
            await accountRepository.save(testAccounts);

            // Create test tab
            testTab = new Tabs();
            testTab.id = `test-tab-${uuid_v4()}`.substring(0, 20);
            testTab.name = 'Test Tab';
            testTab.userId = testAccounts.id;
            testTab.createUserUid = testAccounts.id;
            await tabRepository.save(testTab);
        } catch (error) {
            console.error('Failed to initialize test data:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            // Cleanup test data
            const tabRepository = AppDataSource.getRepository(Tabs);

            if (testTab?.id) {
                await tabRepository.delete(testTab.id);
            }

            // Close database connection
            await AppDataSource.destroy();
        } catch (error) {
            console.error('Failed to cleanup test data:', error);
        }
    });

    it('should return empty array when no tabs exist for user', async () => {
        const result = await getTabsService({ userId: 'non-existent-user' });
        expect(result).toEqual([]);
    });

    it('should return tabs for user', async () => {
        const result = await getTabsService({ userId: testAccounts.id });
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: testTab.id,
                    name: 'Test Tab',
                    userId: testAccounts.id
                })
            ])
        );
    });

    it('should handle database errors', async () => {
        // Force database connection to close to simulate error
        await AppDataSource.destroy();

        await expect(getTabsService({ userId: 'test-user' }))
            .rejects.toThrow();
    });
});
