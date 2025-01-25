/**
 * 受け取ったオブジェクト/配列を再帰的に走査し、
 * 指定したキー名（例: 'date', 'timestamp', 'createdAt', etc.）の値が
 * 文字列なら Date に変換して返す。
 *
 * @param data  変換対象オブジェクト（JSONパース直後のものを想定）
 * @param dateKeys 変換したいキー名リスト
 * @returns 再帰的に走査して変換したオブジェクト（元オブジェクトは不変）
 */
export function parseDateFieldsDeep<T>(
    data: T,
    dateKeys: string[] = ['date', 'timestamp', 'createdAt', 'updatedAt']
): T {
    // null や 原始型（string, number, booleanなど）の場合はそのまま返す
    if (data === null || typeof data !== 'object') {
        return data;
    }
  
    // 配列の場合、要素ごとに再帰的に処理
    if (Array.isArray(data)) {
        return data.map((item) => parseDateFieldsDeep(item, dateKeys)) as unknown as T;
    }
  
    // それ以外（純粋なオブジェクト）の場合
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
        if (dateKeys.includes(key) && typeof value === 'string') {
        // もしキー名が dateKeys に含まれていて、かつ値が string なら Dateに変換
            result[key] = new Date(value);
        } else {
        // 再帰で深い階層の変換も可能
            result[key] = parseDateFieldsDeep(value, dateKeys);
        }
    }
  
    return result as T;
}
  