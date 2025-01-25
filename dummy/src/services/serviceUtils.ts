import { QueryFailedError } from "typeorm";

export const errorQueryHandler = (error: unknown, serviceStr = "不明なリソース") => {
    if (error instanceof QueryFailedError) {
        console.error('DB操作失敗:', error.message);
        throw new Error('DB操作に失敗しました');
    }
    console.error(`${serviceStr} で予期しないエラーが発生しました:`, error);
    throw new Error('予期しないエラーが発生しました');
}