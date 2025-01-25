import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { initializeDatabase } from './db.js';
import { PurchaseService } from './services/purchaseService.js';
import { MethodService } from './services/methodService.js';
import { AccountService } from './services/accountService.js';
import { AssetService } from './services/assetService.js';
import { LogService } from './services/logService.js';
import { TabService } from './services/tabService.js';
import { TaskService } from './services/taskService.js';

// 1) まずは Express アプリを作成
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) DB 初期化を走らせておいて、Promise を変数に入れておく
const dbInitPromise: Promise<void> = (async (): Promise<void> => {
    // ここで DB の初期化
    await initializeDatabase();

    // 初期化が完了したので、サービスやルーティングを設定する
    const accountService = new AccountService();

    app.get('/api/account', async (req, res) => {
        try {
            const result = await accountService.getAll(req.query);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    app.post('/api/account', async (req, res) => {
        try {
            const result = await accountService.create(req.body);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    app.put('/api/account/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const result = await accountService.update(id, req.body);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    app.delete('/api/account/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await accountService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    const purchaseService = new PurchaseService();

    app.get('/api/purchase', async (req, res) => {
        try {
            const result = await purchaseService.getAll(req.query);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    app.put('/api/purchase/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const result = await purchaseService.update(id, updateData);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    app.post('/api/purchase', async (req, res) => {
        try {
            const result = await purchaseService.create(req.body);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    const methodService = new MethodService();

    app.get('/api/method', async (req, res) => {
        try {
            const result = await methodService.getAll(req.query);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    app.post('/api/method', async (req, res) => {
        try {
            const result = await methodService.create(req.body);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    app.put('/api/method/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const result = await methodService.update(id, req.body);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    app.delete('/api/method/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await methodService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    const assetService = new AssetService();

    app.get('/api/asset', async (req, res) => {
        try {
            const result = await assetService.getAll(req.query);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    app.post('/api/asset', async (req, res) => {
        try {
            const result = await assetService.create(req.body);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    app.put('/api/asset/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const result = await assetService.update(id, req.body);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    app.delete('/api/asset/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await assetService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    // Log endpoints
    const logService = new LogService();
    app.get('/api/log', async (req, res) => {
        try {
            const result = await logService.getAll(req.query);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });
    app.post('/api/log', async (req, res) => {
        try {
            const result = await logService.create(req.body);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });
    app.put('/api/log/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const result = await logService.update(id, req.body);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });
    app.delete('/api/log/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await logService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    // Tab endpoints
    const tabService = new TabService();
    app.get('/api/tab', async (req, res) => {
        try {
            const result = await tabService.getAll(req.query);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });
    app.post('/api/tab', async (req, res) => {
        try {
            const result = await tabService.create(req.body);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });
    app.put('/api/tab/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const result = await tabService.update(id, req.body);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });
    app.delete('/api/tab/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await tabService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    // Task endpoints
    const taskService = new TaskService();
    app.get('/api/task', async (req, res) => {
        try {
            const result = await taskService.getAll(req.query);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });
    app.post('/api/task', async (req, res) => {
        try {
            const result = await taskService.create(req.body);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });
    app.put('/api/task/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const result = await taskService.update(id, req.body);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });
    app.delete('/api/task/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await taskService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ error });
        }
    });

})().catch((error) => {
    console.error('Failed to initialize database:', error);
});

// 3) Firebase Functions のハンドラとしてエクスポート
export const api = onRequest(async (req, res) => {
    // リクエストが来た時点で、DB 初期化が終わっているかどうかチェックし、
    // 終わっていなければ待つ。
    await dbInitPromise;
    // DB 初期化完了後に、Express アプリの処理に委譲
    return app(req, res);
});
