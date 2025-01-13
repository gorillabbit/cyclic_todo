import * as functions from 'firebase-functions';
import AppDataSource from './db';
import { Purchases } from '../../entity/entities/Purchases';

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
    const { userId, tabId } = req.query;
    const purchaseRepository = AppDataSource.getRepository(Purchases);

    // Build query with filters
    const queryBuilder = purchaseRepository.createQueryBuilder('purchase');

    if (userId) {
      queryBuilder.andWhere(`user_id = "${userId}"`);
    }

    if (tabId) {
      queryBuilder.andWhere(`tab_id = "${tabId}"`);
    }

    // Add relations
    queryBuilder
      .orderBy('date', 'DESC')
      .addOrderBy('timestamp', 'DESC');

    const purchases = await queryBuilder.getMany();
    res.status(200).json(purchases);
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).send('Internal Server Error');
  }
});
