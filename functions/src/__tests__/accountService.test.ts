import { getAccountsService } from '../services/accountService';
import AppDataSource from '../db';
import { Accounts } from '../../../entity/entities/Accounts';
import { v4 as uuid_v4 } from 'uuid';

describe('getAccountsService Integration Test', () => {
    let testAccount: Accounts;

    beforeAll(async () => {
        try {
            // Initialize database connection
            await AppDataSource.initialize();

            // Create test data
            const accountRepository = AppDataSource.getRepository(Accounts);

            // Create test account
            testAccount = new Accounts();
            testAccount.id = `test-account-${uuid_v4()}`.substring(0, 20);
            testAccount.name = 'Test Account';
            testAccount.email = 'test@example.com';
            await accountRepository.save(testAccount);
        } catch (error) {
            console.error('Failed to initialize test data:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            // Cleanup test data
            const accountRepository = AppDataSource.getRepository(Accounts);

            if (testAccount?.id) {
                await accountRepository.delete(testAccount.id);
            }

            // Close database connection
            await AppDataSource.destroy();
        } catch (error) {
            console.error('Failed to cleanup test data:', error);
        }
    });

    it('should return empty array when no accounts exist', async () => {
        const result = await getAccountsService({ id: 'non-existent-user' });
        expect(result).toEqual(null);
    });

    it('should return accounts for user', async () => {
        const result = await getAccountsService({ id: testAccount.id });
        expect(result).toEqual(
            expect.objectContaining({
                id: testAccount.id,
                name: 'Test Account',
                email: 'test@example.com'
            })

        );
    });

    it('should handle database errors', async () => {
        // Force database connection to close to simulate error
        await AppDataSource.destroy();

        await expect(getAccountsService({ id: testAccount.id }))
            .rejects.toThrow();
    });
});
