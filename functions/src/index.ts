import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { initializeDatabase } from './db.js';
import { Accounts } from '../../entity/entities/Accounts.js';
import { BaseService } from './services/serviceUtils.js';
import { Purchases } from '../../entity/entities/Purchases.js';

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
initializeDatabase().catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});


class AccountService extends BaseService<Accounts> {
    constructor() {
        super(Accounts, 'accounts');
    }
}

const accountService = new AccountService();
app.get('/api/account', async (req, res) => {
    try {
        const result = await accountService.getAll(req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

app.post('/api/account', async (req, res) => {
    try {
        const result = await accountService.create(req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

app.put('/api/account', async (req, res) => {
    const { purchaseId, updateData } = req.body;
    try {
        const result = await accountService.update(purchaseId, updateData);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

class PurchaseService extends BaseService<Purchases> {
    constructor() {
        super(Purchases, 'purchases');
    }
}

const purchaseService = new PurchaseService();
app.get('/api/purchase', async (req, res) => {
    try {
        const result = await purchaseService.getAll(req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

app.post('/api/purchase', async (req, res) => {
    try {
        const result = await purchaseService.create(req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

app.put('/api/purchase', async (req, res) => {
    const { purchaseId, updateData } = req.body;
    try {
        const result = await purchaseService.update(purchaseId, updateData);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

// Export Express app wrapped with Firebase onRequest handler
export const api = onRequest(app);
