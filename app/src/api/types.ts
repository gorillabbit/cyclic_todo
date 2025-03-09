// types.ts  (新規ファイル - 共通の型定義をまとめる)
export type WithId<T> = T & { id: string; };

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 変更: ParamsをTのキー名に限定
// GetFunction の params の型を修正.  Partial<Record<keyof T, string | string[]>> とする. undefinedを許容しない
export type GetFunction<T> = (params?: Partial<Record<keyof T, string | string[]>>) => Promise<T[]>;
// GetSingleFunction の params はidを引数にとるので、型引数から除外
export type GetSingleFunction<T> = (id: string) => Promise<T>;

export type CreateFunction<T> = (data: T) => Promise<T>;
// UpdateFunction の型を修正. id: string と data: Partial<T> を別々の引数とする.
export type UpdateFunction<T> = (id: string, data: Partial<T>) => Promise<Partial<T>>;
export type DeleteFunction = (id: string) => Promise<{}>;