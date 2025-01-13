import { DataSource } from 'typeorm';
import 'reflect-metadata';
import 'dotenv/config';
import { Purchases } from '../../entity/entities/Purchases';
import { Accounts } from '../../entity/entities/Accounts';
import { Tabs } from '../../entity/entities/Tabs';
import { Methods } from '../../entity/entities/Methods';
import { Assets } from '../../entity/entities/Assets';
import { Logs } from '../../entity/entities/Logs';
import { LogsCompleteLogs } from '../../entity/entities/LogsCompleteLogs';
import { PurchaseSchedules } from '../../entity/entities/PurchaseSchedules';
import { PurchaseTemplates } from '../../entity/entities/PurchaseTemplates';
import { Tasks } from '../../entity/entities/Tasks';
import { TransferTemplates } from '../../entity/entities/TransferTemplates';

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [Purchases, Accounts, Tabs, Methods, Assets, Logs, LogsCompleteLogs, PurchaseSchedules, PurchaseTemplates, Tasks, TransferTemplates],
    migrations: [],
    subscribers: [],
});


export default AppDataSource;
