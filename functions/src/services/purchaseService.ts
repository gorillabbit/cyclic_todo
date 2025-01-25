import { DeepPartial, EntityManager } from 'typeorm';
import AppDataSource from '../db.js';
import { BaseService } from './serviceUtils.js';
import { Purchases } from '../../../entity/entities/Purchases.js';

/**
 * Purchases 専用サービスクラス
 * create / update をオーバーライドし、トランザクション内で
 * 「レコード保存 → balance 再計算」を行う。
 */
export class PurchaseService extends BaseService<Purchases> {
    constructor() {
        super(Purchases, 'purchases');
    }

    /**
   * 新規登録 → 同一 userId, assetId を持つレコードの残高を再計算
   */
    override async create(entityData: DeepPartial<Purchases>): Promise<Purchases> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Purchases);

            // 1. 新規作成
            const newPurchase = repo.create(entityData);
            const savedPurchase = await repo.save(newPurchase);

            // 2. 再計算
            //    userId, assetId がない場合は要件に合わせて何もせず終了など
            if (!savedPurchase.userId || !savedPurchase.assetId) {
                return savedPurchase;
            }

            await this.reCalcBalances(manager, savedPurchase.userId, savedPurchase.assetId);

            // 3. 再計算後の状態を取り直して返す
            return await repo.findOneOrFail({ where: { id: savedPurchase.id } });
        });
    }

    /**
     * 既存レコード更新 → 同一 userId, assetId を持つレコードの残高を再計算
     */
    override async update(id: string, updateData: DeepPartial<Purchases>): Promise<Purchases> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Purchases);

            const existing = await repo.findOne({ where: { id } });
            if (!existing) throw new Error('Entity not found');

            // 1. 更新
            const merged = repo.merge(existing, updateData);
            const savedPurchase = await repo.save(merged);

            // 2. 再計算
            if (!savedPurchase.userId || !savedPurchase.assetId) {
                return savedPurchase;
            }

            await this.reCalcBalances(manager, savedPurchase.userId, savedPurchase.assetId);

            // 3. 再計算後の状態を取り直して返す
            return await repo.findOneOrFail({ where: { id: savedPurchase.id } });
        });
    }

    /**
     * 指定した userId + assetId の Purchases 全件を取得し、
     * date (昇順), id (昇順) の順で並べて `difference` を積み上げ、
     * `balance` を更新する。
     */
    private async reCalcBalances(
        manager: EntityManager, userId: string, assetId: string
    ): Promise<void> {
        const repo = manager.getRepository(Purchases);

        // "date" で昇順に並べ、同日に複数ある場合は "id" で昇順に
        const list = await repo.find({
            where: { userId, assetId },
            order: { date: 'ASC', id: 'ASC' },
        });

        let runningBalance = 0;
        for (const purchase of list) {
            // difference が正 or 負かは業務ロジック次第です
            runningBalance += purchase.difference ?? 0;
            purchase.balance = runningBalance;
        }

        await repo.save(list);
    }
}
