const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getMesPleins = async () => {
    const response = await fetch(`${API_URL}/pleins-carburant/mes-pleins`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des pleins');
    }
    return response.json();
};

export const createPlein = async (pleinData) => {
    const response = await fetch(`${API_URL}/pleins-carburant`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pleinData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du plein');
    }
    return response.json();
};
