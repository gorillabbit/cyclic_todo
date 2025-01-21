export const getPurchases = async (userId?: string, tabId?: string): Promise<unknown> => {
    try {
        const params = new URLSearchParams();
        if (userId != null && userId !== '') params.append('userId', userId);
        if (tabId != null && tabId !== '') params.append('tabId', tabId);

        const response = await fetch(`/api/purchases?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching purchases:', error);
        throw error;
    }
};

export const getAccounts = async (userId?: string): Promise<unknown> => {
    try {
        const params = new URLSearchParams();
        if (userId != null && userId !== '') params.append('userId', userId);

        const response = await fetch(`/api/accounts?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw error;
    }
};
