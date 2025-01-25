import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { initializeDatabase } from './db.js';
import { Accounts } from '../../entity/entities/Accounts.js';
import { BaseService } from './services/serviceUtils.js';
import { Methods } from '../../entity/entities/Methods.js';
import { Assets } from '../../entity/entities/Assets.js';
import { PurchaseService } from './services/purchaseService.js';

// 1) まずは Express アプリを作成
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) DB 初期化を走らせておいて、Promise を変数に入れておく
const dbInitPromise: Promise<void> = (async (): Promise<void> => {
    // ここで DB の初期化
    await initializeDatabase();

    // 初期化が完了したので、サービスやルーティングを設定する
    class AccountService extends BaseService<Accounts> {
        constructor() {
            super(Accounts, 'accounts');
        }
    }
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

    class MethodService extends BaseService<Methods> {
        constructor() {
            super(Methods, 'methods');
        }
    }
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

    class AssetService extends BaseService<Assets> {
        constructor() {
            super(Assets, 'assets');
        }
    }
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

    // ← この関数内でやりたい初期化やルーティング設定をすべて終える
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
