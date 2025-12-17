const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getMesTrajets = async (userId) => {
    const response = await fetch(`${API_URL}/trajets/chauffeur/${userId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des trajets');
    return response.json();
};

export const updateTrajetStatut = async (trajetId, statut, extraData = {}) => {
    const response = await fetch(`${API_URL}/trajets/${trajetId}/statut`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ statut, ...extraData })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du statut');
    }
    return response.json();
};

export const downloadOrdreMission = async (trajetId) => {
    const response = await fetch(`${API_URL}/trajets/${trajetId}/pdf`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!response.ok) throw new Error('Erreur lors du téléchargement du PDF');
    
    // Create blob and download link
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordre-mission-${trajetId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};
