import { getPurchases } from '../index';
import AppDataSource from '../db';
import { Purchase } from '../entities/Purchase';
import { Account } from '../entities/Account';
import { Tab } from '../entities/Tab';
import { Method } from '../entities/Method';
import { Asset } from '../entities/Asset';
import { v4 as uuidv4 } from 'uuid';

describe('getPurchases Integration Test', () => {
    let testPurchase: Purchase;
    let testAccount: Account;
    let testTab: Tab;
    let testMethod: Method;
    let testAsset: Asset;
    let mockRequest: any;
    let mockResponse: any;

    beforeAll(async () => {
        // Initialize database connection
        await AppDataSource.initialize();

        // Create test data
        const purchaseRepository = AppDataSource.getRepository(Purchase);
        const accountRepository = AppDataSource.getRepository(Account);
        const tabRepository = AppDataSource.getRepository(Tab);
        const methodRepository = AppDataSource.getRepository(Method);
        const assetRepository = AppDataSource.getRepository(Asset);

        // Create test account
        testAccount = new Account();
        testAccount.id = `test-account-${uuidv4()}`;
        testAccount.name = 'Test Account';
        await accountRepository.save(testAccount);

        // Create test tab
        testTab = new Tab();
        testTab.id = `test-tab-${uuidv4()}`;
        testTab.name = 'Test Tab';
        testTab.user_id = testAccount.id;
        await tabRepository.save(testTab);

        // Create test method
        testMethod = new Method();
        testMethod.id = `test-method-${uuidv4()}`;
        testMethod.label = 'Test Method';
        testMethod.user_id = testAccount.id;
        await methodRepository.save(testMethod);

        // Create test asset
        testAsset = new Asset();
        testAsset.id = `test-asset-${uuidv4()}`;
        testAsset.name = 'Test Asset';
        testAsset.user_id = testAccount.id;
        await assetRepository.save(testAsset);

        // Create test purchase
        testPurchase = new Purchase();
        testPurchase.id = `test-purchase-${uuidv4()}`;
        testPurchase.user_id = testAccount.id;
        testPurchase.tab_id = testTab.id;
        testPurchase.method = testMethod.id;
        testPurchase.asset_id = testAsset.id;
        testPurchase.title = 'Test Purchase';
        testPurchase.price = 1000;
        testPurchase.date = new Date();
        testPurchase.description = 'Test Description';
        await purchaseRepository.save(testPurchase);
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
        const purchaseRepository = AppDataSource.getRepository(Purchase);
        const accountRepository = AppDataSource.getRepository(Account);
        const tabRepository = AppDataSource.getRepository(Tab);
        const methodRepository = AppDataSource.getRepository(Method);
        const assetRepository = AppDataSource.getRepository(Asset);

        await purchaseRepository.delete(testPurchase.id);
        await assetRepository.delete(testAsset.id);
        await methodRepository.delete(testMethod.id);
        await tabRepository.delete(testTab.id);
        await accountRepository.delete(testAccount.id);

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
                    id: testPurchase.id,
                    user_id: testAccount.id,
                    tab_id: testTab.id,
                    title: 'Test Purchase',
                    price: 1000,
                }),
            ])
        );
    });

    it('should filter purchases by user_id and tab_id', async () => {
        // Set query parameters
        mockRequest.query = {
            user_id: testAccount.id,
            tab_id: testTab.id,
        };

        // Execute function
        await getPurchases(mockRequest, mockResponse);

        // Verify response
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        const responseData = mockResponse.json.mock.calls[0][0];
        expect(responseData).toHaveLength(1);
        expect(responseData[0]).toEqual(
            expect.objectContaining({
                id: testPurchase.id,
                user_id: testAccount.id,
                tab_id: testTab.id,
                title: 'Test Purchase',
                price: 1000,
            })
        );
    });

    it('should return empty array for non-existent user_id', async () => {
        // Set query parameters
        mockRequest.query = {
            user_id: 'non-existent-user',
        };

        // Execute function
        await getPurchases(mockRequest, mockResponse);

        // Verify response
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        const responseData = mockResponse.json.mock.calls[0][0];
        expect(responseData).toHaveLength(0);
    });
});
