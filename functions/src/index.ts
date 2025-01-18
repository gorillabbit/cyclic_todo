/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { initializeDatabase } from "./db";
import { getPurchasesService } from "./services/purchaseService";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Initialize database connection
if (process.env.NODE_ENV !== 'test') {
    initializeDatabase().catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });
}

// API: /api/purchases - GET
export const getPurchases = onRequest(async (req, res) => {
    try {
        const { userId, tabId } = req.query;
        const purchases = await getPurchasesService({
            userId: userId?.toString(),
            tabId: tabId?.toString()
        });
        res.status(200).json(purchases);
    } catch (err) {
        console.error('Error fetching purchases:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});