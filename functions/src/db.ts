import { DataSource } from 'typeorm';
import { Purchases } from '../../entity/entities/Purchases.js';
import { Accounts } from '../../entity/entities/Accounts.js';
import { Tabs } from '../../entity/entities/Tabs.js';
import { Methods } from '../../entity/entities/Methods.js';
import { Assets } from '../../entity/entities/Assets.js';
import { Logs } from '../../entity/entities/Logs.js';
import { LogsCompleteLogs } from '../../entity/entities/LogsCompleteLogs.js';
import { PurchaseSchedules } from '../../entity/entities/PurchaseSchedules.js';
import { PurchaseTemplates } from '../../entity/entities/PurchaseTemplates.js';
import { Tasks } from '../../entity/entities/Tasks.js';
import { TransferTemplates } from '../../entity/entities/TransferTemplates.js';

import * as dotenv from 'dotenv';
dotenv.config();

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
        migrations: [],
        subscribers: [],
    }
);

let isInitialized = false;

export const initializeDatabase = async (): Promise<void> => {
    if (isInitialized) return;

    console.log('Initializing database connection');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

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
