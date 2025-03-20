import express, { Request, Response } from 'express';
import cors from 'cors';
import { DeepPartial } from 'typeorm';
import { initializeDatabase } from './db.js';
import { PurchaseService } from './services/purchaseService.js';
import { MethodService } from './services/methodService.js';
import { AccountService } from './services/accountService.js';
import { AssetService } from './services/assetService.js';
import { LogService } from './services/logService.js';
import { TabService } from './services/tabService.js';
import { TaskService } from './services/taskService.js';
import { PurchaseTemplateService } from './services/purchaseTemplateService.js';
import { PurchaseScheduleService } from './services/purchaseScheduleService.js';
import { TransferTemplateService } from './services/transferTemplate.js';
import { LogsCompleteLogService } from './services/logCompleteLogService.js';

const app = express();
const port = process.env.PORT || 4000; // 環境変数PORTを使うか、デフォルトで3000番を使用

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// http://localhost:3000 からのアクセスを許可する場合
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:5173', 'http://100.117.43.3:3000'] }));

const handleServiceError = (res: Response, error: Error): void => {
    console.error('Service error:', error);
    res.status(500).send({ error: error.message || 'Internal Server Error' });
};

// 汎用 GET リクエストハンドラ
const handleGetRequest = async <T>(
    req: Request,
    res: Response,
    serviceMethod: (filters?: Record<string, unknown>, order?: Record<string, 'ASC' | 'DESC'>) => Promise<T[]>
): Promise<void> => {
    try {
        const result = await serviceMethod(req.query);
        res.status(200).send(result);
    } catch (error) {
        handleServiceError(res, error as Error);
    }
};

// 汎用 POST リクエストハンドラ
const handlePostRequest = async <T>(
    req: Request,
    res: Response,
    serviceMethod: (entityData: DeepPartial<T>) => Promise<T>
): Promise<void> => {
    try {
        const result = await serviceMethod(req.body as DeepPartial<T>);
        res.status(201).send(result);
    } catch (error) {
        handleServiceError(res, error as Error);
    }
};

// 汎用 PUT リクエストハンドラ
const handlePutRequest = async <T, U>(
    req: Request,
    res: Response,
    serviceMethod: (id: string, updateData: DeepPartial<T>) => Promise<U>
): Promise<void> => {
    try {
        const id = req.params.id;
        const result = await serviceMethod(id, req.body as DeepPartial<T>);
        res.status(200).send(result);
    } catch (error) {
        handleServiceError(res, error as Error);
    }
};

// 汎用 DELETE リクエストハンドラ
const handleDeleteRequest = async <T>(
    req: Request,
    res: Response,
    serviceMethod: (id: string) => Promise<void>
): Promise<void> => {
    try {
        const id = req.params.id;
        await serviceMethod(id);
        res.status(204).send();
    } catch (error) {
        handleServiceError(res, error as Error);
    }
};

// サービスとエンドポイントを登録するための関数
interface ServiceMethods<T, U> {
    getAll: (filters?: Record<string, unknown>, order?: Record<string, 'ASC' | 'DESC'>) => Promise<T[]>;
    create: (entityData: DeepPartial<T>) => Promise<T>;
    update: (id: string, updateData: DeepPartial<T>) => Promise<U>;
    delete: (id: string) => Promise<void>;
    [key: string]: any; // Index signature
}

// Custom Endpointの型定義
interface CustomEndpoint {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    handler: (req: Request, res: Response) => Promise<void>;
}

const registerServiceEndpoints = <T, U>(
    basePath: string,
    service: ServiceMethods<T, U>,
    customEndpoints: CustomEndpoint[] = [] // デフォルト引数を追加
): void => {
    // Custom Endpoints
    for (const endpoint of customEndpoints) {
        app[endpoint.method](`/api/${basePath}${endpoint.path}`, endpoint.handler);
    }
    // Standard CRUD Endpoints
    app.get(`/api/${basePath}`, async (req, res) => {
        handleGetRequest(req, res, service.getAll.bind(service));
    });

    app.post(`/api/${basePath}`, async (req, res) => {
        handlePostRequest(req, res, service.create.bind(service));
    });

    app.put(`/api/${basePath}/:id`, async (req, res) => {
        handlePutRequest(req, res, service.update.bind(service));
    });

    app.delete(`/api/${basePath}/:id`, async (req, res) => {
        handleDeleteRequest(req, res, service.delete.bind(service));
    });
};


// DB 初期化とサービス登録
(async (): Promise<void> => {
    try {
        await initializeDatabase();

        // Custom Endpointsの定義
        const purchaseCustomEndpoints: CustomEndpoint[] = [
            {
                path: '/re-calc-all/:tabId',
                method: 'put',
                handler: async (req: Request, res: Response): Promise<void> => {
                    try {
                        const purchaseService = new PurchaseService();
                        const result = await purchaseService.reCalcAllBalances(req.params.tabId);
                        res.status(200).send(result);
                    } catch (error) {
                        handleServiceError(res, error as Error);
                    }
                },
            },
        ];

        const logCustomEndpoints: CustomEndpoint[] = [
            {
                path: '/get-shared-logs/:tabId',
                method: 'get',
                handler: async (req: Request, res: Response): Promise<void> => {
                    try {
                        const logService = new LogService();
                        const result = await logService.getSharedLogs(req.params.tabId, req.body.userId);
                        res.status(200).send(result);
                    } catch (error) {
                        handleServiceError(res, error as Error);
                    }
                },
            },
        ];

        registerServiceEndpoints('account', new AccountService());
        registerServiceEndpoints('purchase', new PurchaseService(), purchaseCustomEndpoints); // Custom Endpointsを渡す
        registerServiceEndpoints('purchase-template', new PurchaseTemplateService());
        registerServiceEndpoints('purchase-schedule', new PurchaseScheduleService());
        registerServiceEndpoints('transfer-template', new TransferTemplateService());
        registerServiceEndpoints('method', new MethodService());
        registerServiceEndpoints('asset', new AssetService());
        registerServiceEndpoints('log', new LogService(), logCustomEndpoints); // Custom Endpointsを渡す
        registerServiceEndpoints('log-complete-log', new LogsCompleteLogService());
        registerServiceEndpoints('tab', new TabService());
        registerServiceEndpoints('task', new TaskService());

        // サーバーを起動
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error('Failed to initialize database or start server:', error);
    }
})();