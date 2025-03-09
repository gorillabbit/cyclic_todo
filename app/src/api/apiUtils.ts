import { deleteData, endpointMap, fetchData, sendData, updateData } from './apiClient';
import { CreateFunction, GetFunction, UpdateFunction, DeleteFunction } from './types';  // types.tsからimport
type EndpointKey = keyof typeof endpointMap;

const checkEndpointKey = (endpointKey: string): string => {
    const endpoint = endpointMap[endpointKey];
    if (!endpoint) {
        throw new Error(`Invalid endpoint key: ${endpointKey}`);
    }
    return endpoint;
};
    

// createDataを呼び出す関数を生成する関数 (ファクトリ関数)
export const createApiFunction = <T>(endpointKey: EndpointKey): CreateFunction<T> => {
    const endpoint = checkEndpointKey(endpointKey);
    return (data: T) => sendData<T>(endpoint, 'POST', data);
};

// fetchDataを呼び出す関数を生成する関数 (ファクトリ関数)
export const createGetFunction = <T>(endpointKey: EndpointKey): GetFunction<T> => {
    const endpoint = checkEndpointKey(endpointKey);
    return (params?: Partial<Record<keyof T, string | string[]>>) => fetchData<T[]>(endpoint, params);
};

// updateDataを呼び出す関数を生成する関数 (ファクトリ関数)
export const createUpdateFunction = <T>(endpointKey: EndpointKey): UpdateFunction<T> => {
    const endpoint = checkEndpointKey(endpointKey);
    return (id: string, data: Partial<T>) => updateData<T>(endpoint, id, data);
};

// deleteDataを呼び出す関数を生成する関数 (ファクトリ関数)
export const createDeleteFunction = (endpointKey: EndpointKey): DeleteFunction => {
    const endpoint = checkEndpointKey(endpointKey);
    return (id: string) => deleteData(endpoint, id);
};
