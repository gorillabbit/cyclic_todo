const baseUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL

export const getPurchases = async (userId?: string, tabId?: string): Promise<unknown> => {
    try {
        const params = new URLSearchParams();
        if (userId != null && userId !== '') params.append('user_id', userId);
        if (tabId != null && tabId !== '') params.append('tab_id', tabId);

        const response = await fetch(`${baseUrl}/purchase?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching purchases:', error);
        throw error;
    }
};

export const getAccounts = async (id?: string): Promise<unknown> => {
    try {
        const params = new URLSearchParams();
        if (id != null && id !== '') params.append('id', id);

        const response = await fetch(`${baseUrl}/account?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw error;
    }
};
