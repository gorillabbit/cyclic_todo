import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { initializeDatabase } from './db.js';
import { Accounts } from '../../entity/entities/Accounts.js';
import { BaseService } from './services/serviceUtils.js';
import { Purchases } from '../../entity/entities/Purchases.js';

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

    // ほかの /api/account の POST, PUT など…

    class PurchaseService extends BaseService<Purchases> {
        constructor() {
            super(Purchases, 'purchases');
        }
    }
    const purchaseService = new PurchaseService();

    app.get('/api/purchase', async (req, res) => {
        try {
            const result = await purchaseService.getAll(req.query);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error });
        }
    });

    // ほかの /api/purchase の POST, PUT など…

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
