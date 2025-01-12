import * as functions from 'firebase-functions';
import AppDataSource from './db';
import { Item } from './entities/Item';
import { CompleteLog } from './entities/CompleteLog';
import { Purchase } from './entities/Purchase';

// Initialize the database connection only in production environment
if (process.env.NODE_ENV !== 'test') {
  AppDataSource.initialize()
    .then(() => {
      console.log('Database connection initialized');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });
}

// API: /api/purchases - GET
export const getPurchases = functions.https.onRequest(async (req, res) => {
  try {
    const { user_id, tab_id } = req.query;
    const purchaseRepository = AppDataSource.getRepository(Purchase);

    // Build query with filters
    const queryBuilder = purchaseRepository.createQueryBuilder('purchase');

    if (user_id) {
      queryBuilder.andWhere('purchase.user_id = :user_id', { user_id });
    }

    if (tab_id) {
      queryBuilder.andWhere('purchase.tab_id = :tab_id', { tab_id });
    }

    // Add relations
    queryBuilder
      .leftJoinAndSelect('purchase.user', 'user')
      .leftJoinAndSelect('purchase.tab', 'tab')
      .leftJoinAndSelect('purchase.methodObj', 'methodObj')
      .leftJoinAndSelect('purchase.asset', 'asset')
      .orderBy('purchase.date', 'DESC')
      .addOrderBy('purchase.timestamp', 'DESC');

    const purchases = await queryBuilder.getMany();
    res.status(200).json(purchases);
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).send('Internal Server Error');
  }
});

// API: /api/complete-logs - GET
export const getCompleteLogs = functions.https.onRequest(async (req, res) => {
  try {
    const { user_id, tab_id } = req.query;
    const completeLogRepository = AppDataSource.getRepository(CompleteLog);

    // Build query with filters
    const queryBuilder = completeLogRepository.createQueryBuilder('complete_log');

    if (user_id) {
      queryBuilder.andWhere('complete_log.user_id = :user_id', { user_id });
    }

    if (tab_id) {
      queryBuilder.andWhere('complete_log.tab_id = :tab_id', { tab_id });
    }

    // Add relations
    queryBuilder
      .leftJoinAndSelect('complete_log.user', 'user')
      .leftJoinAndSelect('complete_log.log', 'log')
      .leftJoinAndSelect('complete_log.tab', 'tab')
      .orderBy('complete_log.timestamp', 'DESC');

    const completeLogs = await queryBuilder.getMany();
    res.status(200).json(completeLogs);
  } catch (err) {
    console.error('Error fetching complete logs:', err);
    res.status(500).send('Internal Server Error');
  }
});

// API: /api/items - GET
export const getItems = functions.https.onRequest(async (req, res) => {
  try {
    const itemRepository = AppDataSource.getRepository(Item);
    const items = await itemRepository.find();
    res.status(200).json(items);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// API: /api/items - POST
export const addItem = functions.https.onRequest(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).send('Missing "name" in request body');
    return;
  }

  try {
    const itemRepository = AppDataSource.getRepository(Item);
    const item = new Item();
    item.name = name;
    const result = await itemRepository.save(item);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Internal Server Error');
  }
});
