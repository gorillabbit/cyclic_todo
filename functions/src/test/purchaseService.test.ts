
import { Purchases } from '../../../entity/entities/Purchases';
import { Accounts } from '../../../entity/entities/Accounts';
import { Tabs } from '../../../entity/entities/Tabs';
import { Methods } from '../../../entity/entities/Methods';
import { Assets } from '../../../entity/entities/Assets';
import { v4 as uuidV4 } from 'uuid';
import AppDataSource from '../db';
import { getPurchases } from '..';

describe('getPurchases Integration Test', () => {
    let testPurchases: Purchases;
    let testAccounts: Accounts;
    let testTabs: Tabs;
    let testMethods: Methods;
    let testAssets: Assets;
    let mockRequest: any;
    let mockResponse: any;

    beforeAll(async () => {
        try {
            // Initialize database connection
            await AppDataSource.initialize();

            // Create test data
            const purchaseRepository = AppDataSource.getRepository(Purchases);
            const accountRepository = AppDataSource.getRepository(Accounts);
            const tabRepository = AppDataSource.getRepository(Tabs);
            const methodRepository = AppDataSource.getRepository(Methods);
            const assetRepository = AppDataSource.getRepository(Assets);

            // Create test account
            testAccounts = new Accounts();
            testAccounts.id = `test-account-${uuidV4()}`.substring(0, 20);
            testAccounts.name = 'Test Accounts';
            await accountRepository.save(testAccounts);

            // Create test tab
            testTabs = new Tabs();
            testTabs.id = `test-tab-${uuidV4()}`.substring(0, 20);
            testTabs.name = 'Test Tabs';
            testTabs.userId = testAccounts.id;
            testTabs.createUserUid = testAccounts.id;
            await tabRepository.save(testTabs);

            // Create test asset
            testAssets = new Assets();
            testAssets.id = `test-asset-${uuidV4()}`.substring(0, 20);
            testAssets.name = 'Test Assets';
            testAssets.userId = testAccounts.id;
            testAssets.tabId = testTabs.id;
            await assetRepository.save(testAssets);

            // Create test method
            testMethods = new Methods();
            testMethods.id = `test-method-${uuidV4()}`.substring(0, 20);
            testMethods.label = 'Test Methods';
            testMethods.tabId = testTabs.id;
            testMethods.userId = testAccounts.id;
            testMethods.assetId = testAssets.id;
            await methodRepository.save(testMethods);

            // Create test purchase
            testPurchases = new Purchases();
            testPurchases.id = `test-purchase-${uuidV4()}`.substring(0, 20);
            testPurchases.userId = testAccounts.id;
            testPurchases.tabId = testTabs.id;
            testPurchases.method = testMethods.id;
            testPurchases.assetId = testAssets.id;
            testPurchases.title = 'Test Purchases';
            testPurchases.price = 1000;
            testPurchases.date = new Date();
            testPurchases.description = 'Test Description';
            await purchaseRepository.save(testPurchases);
        } catch (error) {
            console.error('Failed to initialize test data:', error);
            throw error;
        }
    });

    beforeEach(() => {
        // Setup request and response mocks
        mockRequest = {
            query: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterAll(async () => {
        try {
            // Cleanup test data
            const purchaseRepository = AppDataSource.getRepository(Purchases);
            const accountRepository = AppDataSource.getRepository(Accounts);
            const tabRepository = AppDataSource.getRepository(Tabs);
            const methodRepository = AppDataSource.getRepository(Methods);
            const assetRepository = AppDataSource.getRepository(Assets);

            if (testPurchases?.id) {
                await purchaseRepository.delete(testPurchases.id);
            }
            if (testMethods?.id) {
                await methodRepository.delete(testMethods.id);
            }
            if (testAssets?.id) {
                await assetRepository.delete(testAssets.id);
            }
            if (testTabs?.id) {
                await tabRepository.delete(testTabs.id);
            }
            if (testAccounts?.id) {
                await accountRepository.delete(testAccounts.id);
            }

            // Close database connection
            await AppDataSource.destroy();
        } catch (error) {
            console.error('Failed to cleanup test data:', error);
        }
    });

    it('should fetch purchases with no filters', async () => {
        await getPurchases(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        const responseData = mockResponse.json.mock.calls[0][0];
        expect(responseData).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: testPurchases.id,
                    userId: testAccounts.id,
                    tabId: testTabs.id,
                    title: 'Test Purchases',
                    price: 1000,
                }),
            ])
        );
    });

    it('should filter purchases by userId and tabId', async () => {
        mockRequest.query = {
            userId: testAccounts.id,
            tabId: testTabs.id,
        };

        await getPurchases(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        const responseData = mockResponse.json.mock.calls[0][0];
        expect(responseData).toHaveLength(1);
        expect(responseData[0]).toEqual(
            expect.objectContaining({
                id: testPurchases.id,
                userId: testAccounts.id,
                tabId: testTabs.id,
                title: 'Test Purchases',
                price: 1000,
            })
        );
    });

    it('should return empty array for non-existent userId', async () => {
        mockRequest.query = {
            userId: 'non-existent-user',
        };

        await getPurchases(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        const responseData = mockResponse.json.mock.calls[0][0];
        expect(responseData).toHaveLength(0);
    });
});
