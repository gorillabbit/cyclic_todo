export const baseUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL;

export type WithId<T> = T & {
    id: string;
  };

// 汎用データ送信関数
export const sendData = async <T>(
    endpoint: string,
    method: 'POST' | 'PUT' | 'DELETE',
    data: T
): Promise<WithId<T>> => {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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
    return sendData(`${endpoint}/${id}`, 'DELETE', {});
};

// 汎用GETヘルパー関数
export const fetchData = async <T>(
    endpoint: string,
    params: Record<string, string | string[] | undefined>
): Promise<T> => {
    try {
        const urlParams = new URLSearchParams();

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
