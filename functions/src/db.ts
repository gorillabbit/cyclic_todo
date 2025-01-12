import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { Item } from './entities/Item';
import { CompleteLog } from './entities/CompleteLog';
import { Purchase } from './entities/Purchase';
import { Account } from './entities/Account';
import { Tab } from './entities/Tab';
import { Method } from './entities/Method';
import { Asset } from './entities/Asset';
import { Log } from './entities/Log';
import 'dotenv/config';

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [Item, CompleteLog, Purchase, Account, Tab, Method, Asset, Log],
    migrations: [],
    subscribers: [],
});

export default AppDataSource;
