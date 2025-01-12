import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { Item } from './entities/Item';
import { CompleteLog } from './entities/CompleteLog';
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
    entities: [Item, CompleteLog],
    migrations: [],
    subscribers: [],
});

export default AppDataSource;
