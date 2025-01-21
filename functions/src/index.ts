import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { initializeDatabase } from './db.js';
import { getPurchasesService } from './services/purchaseService.js';
import { getAccountsService } from './services/accountService.js';

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
if (process.env.NODE_ENV !== 'test') {
    initializeDatabase().catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });
}

// Mount existing purchase endpoint
app.get('/api/purchases', async (req, res) => {
    try {
        const { userId, tabId } = req.query;
        const purchases = await getPurchasesService({
            userId: userId?.toString(),
            tabId: tabId?.toString(),
        });
        res.status(200).json(purchases);
    } catch (err) {
        console.error('Error fetching purchases:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Mount existing purchase endpoint
app.get('/api/accounts', async (req, res) => {
    try {
        const { userId } = req.query;
        const purchases = await getAccountsService({
            userId: userId?.toString(),
        });
        res.status(200).json(purchases);
    } catch (err) {
        console.error('Error fetching purchases:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export Express app wrapped with Firebase onRequest handler
export const api = onRequest(app);
