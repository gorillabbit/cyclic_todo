import { DataSource } from 'typeorm';
import { Purchases } from './entities/Purchases.js';
import { Accounts } from './entities/Accounts.js';
import { Tabs } from './entities/Tabs.js';
import { Methods } from './entities/Methods.js';
import { Assets } from './entities/Assets.js';
import { Logs } from './entities/Logs.js';
import { LogsCompleteLogs } from './entities/LogsCompleteLogs.js';
import { PurchaseSchedules } from './entities/PurchaseSchedules.js';
import { PurchaseTemplates } from './entities/PurchaseTemplates.js';
import { Tasks } from './entities/Tasks.js';
import { TransferTemplates } from './entities/TransferTemplates.js';

import * as dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
dotenv.config({ path: envFile });

const AppDataSource = new DataSource(
    {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt((process.env.DB_PORT ?? '') || '3306'),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: false,
        logging: true,
        entities: [
            Purchases,
            Accounts,
            Tabs,
            Methods,
            Assets,
            Logs,
            LogsCompleteLogs,
            PurchaseSchedules,
            PurchaseTemplates,
            Tasks,
            TransferTemplates,
        ],
        migrations: ['./migration/**/*.js'],
        subscribers: [],
    }
);

let isInitialized = false;

export const initializeDatabase = async (): Promise<void> => {
    if (isInitialized) return;

    try {
        await AppDataSource.initialize();
        isInitialized = true;
        console.log('DB接続が初期化されました');
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export default AppDataSource;
