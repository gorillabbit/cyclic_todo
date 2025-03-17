import { MigrationInterface, QueryRunner } from 'typeorm';

const tables = [
    'purchases',
    'tabs',
    'methods',
    'assets',
    'logs',
    'logs_complete_logs',
    'purchase_schedules',
    'purchase_templates',
    'tasks',
    'transfer_templates'
];

export class MigrateTimestampsSeparatedCommits1678886400000 implements MigrationInterface {
    name = 'MigrateTimestampsSeparatedCommits1678886400000'
    

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. NULL値の置き換え
        await queryRunner.startTransaction();
        try {
            for (const table of tables) {
                console.log(`Updating ${table}...`);
                await queryRunner.query(`UPDATE \`${table}\` SET \`timestamp\` = CURRENT_TIMESTAMP WHERE \`timestamp\` IS NULL`);
            }
            await queryRunner.commitTransaction();
            console.log('NULL timestamps replaced successfully.');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('NULL replacement migration failed:', error);
            throw error; // エラーを再スローして、以降の処理を中断
        }

        // 2. テーブル定義の更新
        await queryRunner.startTransaction();
        try {
            for (const table of tables) {
                await queryRunner.query(`ALTER TABLE \`${table}\` CHANGE \`timestamp\` \`timestamp\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            }
            await queryRunner.commitTransaction();
            console.log('Timestamp columns updated to NOT NULL successfully.');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('NOT NULL migration failed:', error);
            throw error; // エラーを再スローして、以降の処理を中断
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ロールバックも同様にトランザクションを分ける
        // 1. NOT NULL制約の削除
        await queryRunner.startTransaction();
        try {
            for (const table of tables) {
                await queryRunner.query(`ALTER TABLE \`${table}\` CHANGE \`timestamp\` \`timestamp\` datetime NULL DEFAULT CURRENT_TIMESTAMP`);
            }
            await queryRunner.commitTransaction();
            console.log('NOT NULL constraints removed successfully.');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('NOT NULL rollback failed:', error);
            throw error; // エラーを再スローして、以降の処理を中断
        }

        // 2. NULL値の再設定 (これは実際には難しいので、警告を表示)
        console.warn('Reverting NULL values is complex and may require manual intervention.');
    }
}