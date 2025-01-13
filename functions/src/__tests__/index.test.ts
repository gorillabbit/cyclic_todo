import { getPurchases } from '../index';
import AppDataSource from '../db';
import { Purchases } from '../../../entity/entities/Purchases';
import { Accounts } from '../../../entity/entities/Accounts';
import { Tabs } from '../../../entity/entities/Tabs';
import { Methods } from '../../../entity/entities/Methods';
import { Assets } from '../../../entity/entities/Assets';
import { v4 as uuid_v4 } from 'uuid';

describe('getPurchases Integration Test', () => {
    let testPurchases: Purchases;
    let testAccounts: Accounts;
    let testTabs: Tabs;
    let testMethods: Methods;
    let testAssets: Assets;
    let mockRequest: any;
    let mockResponse: any;

    beforeAll(async () => {
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
        testAccounts.id = `test-account-${uuid_v4()}`.substring(0, 20);
        testAccounts.name = 'Test Accounts';
        const res = await accountRepository.save(testAccounts);
        console.log('res', res);

        // Create test tab
        testTabs = new Tabs();
        testTabs.id = `test-tab-${uuid_v4()}`.substring(0, 20);
        testTabs.name = 'Test Tabs';
        testTabs.userId = testAccounts.id;
        testTabs.createUserUid = testAccounts.id;
        await tabRepository.save(testTabs);

        // Create test asset
        testAssets = new Assets();
        testAssets.id = `test-asset-${uuid_v4()}`.substring(0, 20);
        testAssets.name = 'Test Assets';
        testAssets.userId = testAccounts.id;
        testAssets.tabId = testTabs.id;
        await assetRepository.save(testAssets);

        // Create test method
        testMethods = new Methods();
        testMethods.id = `test-method-${uuid_v4()}`.substring(0, 20);
        testMethods.label = 'Test Methods';
        testMethods.tabId = testTabs.id;
        testMethods.userId = testAccounts.id;
        testMethods.assetId = testAssets.id;
        await methodRepository.save(testMethods);

        // Create test purchase
        testPurchases = new Purchases();
        testPurchases.id = `test-purchase-${uuid_v4()}`.substring(0, 20);
        testPurchases.userId = testAccounts.id;
        testPurchases.tabId = testTabs.id;
        testPurchases.method = testMethods.id;
        testPurchases.assetId = testAssets.id;
        testPurchases.title = 'Test Purchases';
        testPurchases.price = 1000;
        testPurchases.date = new Date();
        testPurchases.description = 'Test Description';
        await purchaseRepository.save(testPurchases);
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
        // Cleanup test data
        const purchaseRepository = AppDataSource.getRepository(Purchases);
        const accountRepository = AppDataSource.getRepository(Accounts);
        const tabRepository = AppDataSource.getRepository(Tabs);
        const methodRepository = AppDataSource.getRepository(Methods);
        const assetRepository = AppDataSource.getRepository(Assets);

        await purchaseRepository.delete(testPurchases.id);
        await methodRepository.delete(testMethods.id);
        await assetRepository.delete(testAssets.id);
        await tabRepository.delete(testTabs.id);
        await accountRepository.delete(testAccounts.id);

        // Close database connection
        await AppDataSource.destroy();
    });

    it('should fetch purchases with no filters', async () => {
        // Execute function
        await getPurchases(mockRequest, mockResponse);

        // Verify response
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
        // Set query parameters
        mockRequest.query = {
            userId: testAccounts.id,
            tabId: testTabs.id,
        };

        // Execute function
        await getPurchases(mockRequest, mockResponse);

        // Verify response
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
        // Set query parameters
        mockRequest.query = {
            userId: 'non-existent-user',
        };

        // Execute function
        await getPurchases(mockRequest, mockResponse);

        // Verify response
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        const responseData = mockResponse.json.mock.calls[0][0];
        expect(responseData).toHaveLength(0);
    });
});
