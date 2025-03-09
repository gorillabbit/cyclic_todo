import { HttpMethod, WithId } from './types';

export const baseUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL;

// エンドポイントと型のマッピング (Recordを使用)
export const endpointMap: Record<string, string> = {
    method: '/method',
    asset: '/asset',
    account: '/account',
    task: '/task',
    log: '/log',
    logCompleteLog: '/log-complete-log',
    purchaseSchedule: '/purchase-schedule',
    purchaseTemplate: '/purchase-template',
    transferTemplate: '/transfer-template',
    tab: '/tab',
    purchase: '/purchase',
};

// 汎用データ送信関数
export const sendData = async <T>(
    endpoint: string,
    method: HttpMethod, // HttpMethod型を使用
    data?: T // dataをオプショナルに
): Promise<WithId<T>> => { // WithId を使用
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: method,
            headers: {
                ...(Boolean(data) && { 'Content-Type': 'application/json' }), // dataがある場合のみContent-Typeを設定
            },
            body: Boolean(data) ? JSON.stringify(data) : undefined, // dataがある場合のみJSON.stringify
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error ${method.toLowerCase()}ing data:`, error);
        throw error;
    }
};

// データ更新共通関数
export const updateData = async <T>(
    endpoint: string,
    id: string,
    data: Partial<T>
): Promise<Partial<T>> => {
    return sendData(`${endpoint}/${id}`, 'PUT', data);
};

// データ削除共通関数
export const deleteData = async (
    endpoint: string,
    id: string
): Promise<{}> => {
    return sendData(`${endpoint}/${id}`, 'DELETE'); // sendDataのdata引数はオプショナルなので{}を渡す必要はない
};

// 汎用GETヘルパー関数
export const fetchData = async <T>(
    endpoint: string,
    params?: Record<string, string | string[] | undefined> // paramsをオプショナルに
): Promise<T> => {
    try {
        const urlParams = new URLSearchParams();

        if (params) { // paramsが存在する場合のみ処理
            Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v) => {
                        if (v != null && v !== '') {
                            urlParams.append(key, v);
                        }
                    });
                } else if (value != null && value !== '') {
                    urlParams.append(key, value);
                }
            });
        }

        const response = await fetch(`${baseUrl}${endpoint}?${urlParams.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
