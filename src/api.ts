const API_BASE_URL = 'https://<region>-<project-id>.cloudfunctions.net';

export const fetchItems = async () => {
    const response = await fetch(`${API_BASE_URL}/getItems`);
    if (!response.ok) {
        throw new Error('Failed to fetch items');
    }
    return response.json();
};

export const addItem = async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/addItem`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        throw new Error('Failed to add item');
    }
    return response.json();
};
