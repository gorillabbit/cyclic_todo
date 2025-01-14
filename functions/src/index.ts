import * as functions from 'firebase-functions';
import { initializeDatabase } from './db';
import { getPurchasesService } from './services/purchaseService';
import { getAccountsService } from './services/accountService';
import { getTabsService } from './services/tabService';
import { getMethodsService } from './services/methodService';
import { getAssetsService } from './services/assetService';

// Initialize database connection
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase().catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
}

// API: /api/purchases - GET
export const getPurchases = functions.https.onRequest(async (req, res) => {
  try {
    const { userId, tabId } = req.query;
    console.log('userId:', userId, userId?.toString());
    console.log('tabId:', tabId);
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

// API: /api/accounts - GET
export const getAccounts = functions.https.onRequest(async (req, res) => {
  try {
    const { userId } = req.query;
    const accounts = await getAccountsService({
      userId: userId?.toString()
    });
    res.status(200).json(accounts);
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: /api/tabs - GET
export const getTabs = functions.https.onRequest(async (req, res) => {
  try {
    const { userId } = req.query;
    const tabs = await getTabsService({
      userId: userId?.toString()
    });
    res.status(200).json(tabs);
  } catch (err) {
    console.error('Error fetching tabs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: /api/methods - GET
export const getMethods = functions.https.onRequest(async (req, res) => {
  try {
    const { userId } = req.query;
    const methods = await getMethodsService({
      userId: userId?.toString()
    });
    res.status(200).json(methods);
  } catch (err) {
    console.error('Error fetching methods:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: /api/assets - GET
export const getAssets = functions.https.onRequest(async (req, res) => {
  try {
    const { userId } = req.query;
    const assets = await getAssetsService({
      userId: userId?.toString()
    });
    res.status(200).json(assets);
  } catch (err) {
    console.error('Error fetching assets:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
