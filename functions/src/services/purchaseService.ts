import { DeepPartial, EntityManager } from 'typeorm';
import AppDataSource from '../db.js';
import { BaseService } from './serviceUtils.js';
import { Purchases } from '../entities/Purchases.js';

/**
 * Purchases 専用サービスクラス
 * ※ userId は考慮せず、assetId のみをキーとして残高計算を行う。
 */
export class PurchaseService extends BaseService<Purchases> {
    constructor() {
        super(Purchases, 'purchases');
    }

    /**
   * 新規登録 → (payDate 未変更なので) 部分再計算のみ
   */
    override async create(entityData: DeepPartial<Purchases>): Promise<Purchases> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Purchases);

            // 1. 新規作成
            const newPurchase = repo.create(entityData);
            const savedPurchase = await repo.save(newPurchase);

            // 2. 再計算
            if (!savedPurchase.assetId) {
                // assetId が無いなら残高再計算不要
                return savedPurchase;
            }

            // payDate の「変更前」がないので、部分再計算でOK
            await this.reCalcBalancesFrom(
                manager,
                savedPurchase.assetId,
                savedPurchase.id
            );

            // 3. 再計算後の状態を取り直して返す
            return await repo.findOneOrFail({ where: { id: savedPurchase.id } });
        });
    }

    /**
   * 既存レコード更新
   *   → payDate が変わったら全件再計算、変わらなければ部分再計算
   */
    override async update(id: string, updateData: DeepPartial<Purchases>): Promise<Purchases> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            try {
                const repo = manager.getRepository(Purchases);

                const existing = await repo.findOne({ where: { id } });
                if (!existing) throw new Error('Entity not found');

                // 1. 更新
                const merged = repo.merge(existing, updateData);
                const savedPurchase = await repo.save(merged);

                // 2. payDate が変更されているかどうか
                //    - DeepPartial で受けているため、型アサーションなど適宜必要
                const isPayDateChanged =
        updateData.payDate != null && // null or undefined 以外
        existing.payDate !== new Date(updateData.payDate as string | Date);

                // 3. 再計算
                if (!savedPurchase.assetId) {
                    return savedPurchase;
                }

                if (isPayDateChanged) {
                // payDate が変わった場合は全件再計算（同じ assetId だけ全件）
                    await this.reCalcBalances(manager, savedPurchase.assetId);
                } else {
                // payDate が変わっていない場合は部分再計算
                    await this.reCalcBalancesFrom(
                        manager,
                        savedPurchase.assetId,
                        savedPurchase.id
                    );
                }

                // 4. 再計算後の状態を取り直して返す
                return await repo.findOneOrFail({ where: { id: savedPurchase.id } });
            } catch (error) {
            // ここで詳細なエラーをログ出力する
                console.error('Transaction Error:', error);
                throw error; // ここで再スローしてトランザクションにロールバックを指示
            }
        });
    }

    /**
   * 既存レコード削除 → 削除したレコードより以降だけ部分再計算
   */
    override async delete(id: string): Promise<void> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Purchases);

            // 1. 削除対象を取得
            const existing = await repo.findOne({ where: { id } });
            if (!existing) return;

            // 2. 削除実行
            await repo.delete(id);

            // 3. payDate が変わったわけではないが、削除したレコード以降を部分再計算
            if (!existing.assetId) {
                return;
            }
            await this.reCalcBalancesFrom(
                manager,
                existing.assetId,
                existing.id,
                existing.payDate ?? undefined
            );
        });
    }

    //--------------------------------------------------------------------------
    // 以降、再計算に使うメソッド (assetId のみをキーとする)
    //--------------------------------------------------------------------------

    /**
   * 指定した assetId の全レコードを日付昇順（同日の場合はID昇順）で並べ直し、
   * 先頭から順に difference を積み上げて balance を更新する（全件再計算）。
   */
    private async reCalcBalances(
        manager: EntityManager,
        assetId: string
    ): Promise<void> {
        const repo = manager.getRepository(Purchases);

        const list = await repo.find({
            where: { assetId },
            order: { payDate: 'ASC', id: 'ASC' },
        });

        let runningBalance = 0;
        for (const purchase of list) {
            runningBalance += purchase.difference ?? 0;
            purchase.balance = runningBalance;
        }

        await repo.save(list);
    }

    /**
   * 「(payDate, id) が指定したレコード以降」だけ部分的に再計算する。
   *
   * @param fromPurchaseId 更新/削除/追加したレコードのID
   * @param fromPayDate    削除時などIDでレコードを見つけられないとき用
   */
    private async reCalcBalancesFrom(
        manager: EntityManager,
        assetId: string,
        fromPurchaseId: string,
        fromPayDate?: Date
    ): Promise<void> {
        const repo = manager.getRepository(Purchases);

        // 1. 変更(または削除)されたレコードを取得
        let changedPurchase = await repo.findOne({ where: { id: fromPurchaseId } });
        if (!changedPurchase && fromPayDate) {
            // 削除で見つからない場合 → fromPayDate を使い、仮レコード情報を作成
            changedPurchase = new Purchases();
            changedPurchase.id = fromPurchaseId;
            changedPurchase.payDate = fromPayDate;
        }
        if (!changedPurchase) {
            // 取得できなければ終了
            return;
        }

        // 2. 変更対象より「直前」のレコードを1件取得
        const precedingPurchase = await repo
            .createQueryBuilder('p')
            .where('p.assetId = :assetId', { assetId })
            .andWhere(
                '(p.payDate < :payDate) OR (p.payDate = :payDate AND p.id < :id)',
                {
                    payDate: changedPurchase.payDate,
                    id: changedPurchase.id,
                }
            )
            .orderBy('p.payDate', 'DESC')
            .addOrderBy('p.id', 'DESC')
            .getOne();

        const baseBalance = precedingPurchase?.balance ?? 0;

        // 3. (payDate, id) が 変更対象と同じ or 後 のレコードを取得
        const subsequentPurchases = await repo
            .createQueryBuilder('p')
            .where('p.assetId = :assetId', { assetId })
            .andWhere(
                '(p.payDate > :payDate) OR (p.payDate = :payDate AND p.id >= :id)',
                {
                    payDate: changedPurchase.payDate,
                    id: changedPurchase.id,
                }
            )
            .orderBy('p.payDate', 'ASC')
            .addOrderBy('p.id', 'ASC')
            .getMany();

        // 4. 直前レコードの balance を初期値として差分を積み上げ
        let runningBalance = baseBalance;
        for (const p of subsequentPurchases) {
            runningBalance += p.difference ?? 0;
            p.balance = runningBalance;
        }

        // 5. 保存
        await repo.save(subsequentPurchases);
    }

    /**
   * すべての Purchases の残高を再計算（必要に応じて実行）
   * ＝ テーブル全件を対象とするが、assetId が同じなら続けて積み上げ。
   */
    async reCalcAllBalances(tabId:string): Promise<void> {
        return AppDataSource.manager.transaction(async (manager: EntityManager) => {
            const repo = manager.getRepository(Purchases);

            // 全件を assetId, payDate, id の順でソート
            const all = await repo.find({
                where: { tabId },
                order: { assetId: 'ASC', payDate: 'ASC', id: 'ASC' },
            });

            let currentAsset = '';
            let runningBalance = 0;

            for (const purchase of all) {
                // assetId が変わるたびに runningBalance をリセット
                if (purchase.assetId !== currentAsset) {
                    currentAsset = purchase.assetId;
                    runningBalance = 0;
                }

                runningBalance += purchase.difference ?? 0;
                purchase.balance = runningBalance;
            }

            await repo.save(all);
        });
    }
}
