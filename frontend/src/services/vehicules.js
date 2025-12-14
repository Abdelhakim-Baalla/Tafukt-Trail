const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ==================== CAMIONS ====================

export const getAllCamions = async () => {
  const response = await fetch(`${API_URL}/camions`, { headers: getHeaders() });
  return response.json();
};

export const getCamionById = async (id) => {
  const response = await fetch(`${API_URL}/camions/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const getCamionsByStatut = async (statut) => {
  const response = await fetch(`${API_URL}/camions/statut/${statut}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const createCamion = async (data) => {
  const response = await fetch(`${API_URL}/camions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateCamion = async (id, data) => {
  const response = await fetch(`${API_URL}/camions/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteCamion = async (id) => {
  const response = await fetch(`${API_URL}/camions/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.json();
};

// ==================== REMORQUES ====================

export const getAllRemorques = async () => {
  const response = await fetch(`${API_URL}/remorques`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const getRemorqueById = async (id) => {
  const response = await fetch(`${API_URL}/remorques/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const getRemorquesByStatut = async (statut) => {
  const response = await fetch(`${API_URL}/remorques/statut/${statut}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const createRemorque = async (data) => {
  const response = await fetch(`${API_URL}/remorques`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateRemorque = async (id, data) => {
  const response = await fetch(`${API_URL}/remorques/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteRemorque = async (id) => {
  const response = await fetch(`${API_URL}/remorques/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.json();
};

// ==================== PNEUS ====================

export const getAllPneus = async () => {
  const response = await fetch(`${API_URL}/pneus`, { headers: getHeaders() });
  return response.json();
};

export const getPneuById = async (id) => {
  const response = await fetch(`${API_URL}/pneus/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const getPneusByPosition = async (position) => {
  const response = await fetch(`${API_URL}/pneus/position/${position}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const createPneu = async (data) => {
  const response = await fetch(`${API_URL}/pneus`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updatePneu = async (id, data) => {
  const response = await fetch(`${API_URL}/pneus/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deletePneu = async (id) => {
  const response = await fetch(`${API_URL}/pneus/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.json();
};

// ==================== ENUMS ====================

export const STATUT_VEHICULE = {
  DISPONIBLE: "DISPONIBLE",
  EN_MISSION: "EN_MISSION",
  EN_MAINTENANCE: "EN_MAINTENANCE",
  HORS_SERVICE: "HORS_SERVICE",
  RESERVE: "RESERVE",
};

export const TYPE_CARBURANT = {
  DIESEL: "DIESEL",
  ESSENCE: "ESSENCE",
  GAZ: "GAZ",
  ELECTRIQUE: "ELECTRIQUE",
};

export const TYPE_REMORQUE = {
  FOURGON: "FOURGON",
  FRIGORIFIQUE: "FRIGORIFIQUE",
  PORTEUR: "PORTEUR",
  BENNE: "BENNE",
  CITERNE: "CITERNE",
  PLATEAU: "PLATEAU",
};

export const POSITION_PNEU = {
  AVANT_GAUCHE: "AVANT_GAUCHE",
  AVANT_DROIT: "AVANT_DROIT",
  ARRIERE_GAUCHE: "ARRIERE_GAUCHE",
  ARRIERE_DROIT: "ARRIERE_DROIT",
  ROULE_DE_SECOURS: "ROULE_DE_SECOURS",
};

// Labels pour affichage
export const STATUT_VEHICULE_LABELS = {
  DISPONIBLE: "Disponible",
  EN_MISSION: "En mission",
  EN_MAINTENANCE: "Maintenance",
  HORS_SERVICE: "Hors service",
  RESERVE: "Réservé",
};

export const TYPE_CARBURANT_LABELS = {
  DIESEL: "Diesel",
  ESSENCE: "Essence",
  GAZ: "Gaz",
  ELECTRIQUE: "Électrique",
};

export const TYPE_REMORQUE_LABELS = {
  FOURGON: "Fourgon",
  FRIGORIFIQUE: "Frigorifique",
  PORTEUR: "Porteur",
  BENNE: "Benne",
  CITERNE: "Citerne",
  PLATEAU: "Plateau",
};

export const POSITION_PNEU_LABELS = {
  AVANT_GAUCHE: "Avant gauche",
  AVANT_DROIT: "Avant droit",
  ARRIERE_GAUCHE: "Arrière gauche",
  ARRIERE_DROIT: "Arrière droit",
  ROULE_DE_SECOURS: "Roue de secours",
};

// ==================== TRAJETS ====================

export const getAllTrajets = async () => {
  const response = await fetch(`${API_URL}/trajets`, { headers: getHeaders() });
  return response.json();
};

export const getTrajetById = async (id) => {
  const response = await fetch(`${API_URL}/trajets/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const getTrajetsByChauffeur = async (chauffeurId) => {
  const response = await fetch(`${API_URL}/trajets/chauffeur/${chauffeurId}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const getTrajetsByStatut = async (statut) => {
  const response = await fetch(`${API_URL}/trajets/statut/${statut}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const createTrajet = async (data) => {
  const response = await fetch(`${API_URL}/trajets`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateTrajet = async (id, data) => {
  const response = await fetch(`${API_URL}/trajets/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateTrajetStatut = async (id, statut) => {
  const response = await fetch(`${API_URL}/trajets/${id}/statut`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ statut }),
  });
  return response.json();
};

export const deleteTrajet = async (id) => {
  const response = await fetch(`${API_URL}/trajets/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.json();
};

export const getTrajetPdf = async (id) => {
  const response = await fetch(`${API_URL}/trajets/${id}/pdf`, {
    headers: getHeaders(),
  });
  return response.blob();
};

// ==================== UTILISATEURS (Chauffeurs) ====================

export const getAllChauffeurs = async () => {
  const response = await fetch(`${API_URL}/auth/chauffeurs`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/auth/users`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

// ==================== PLEINS CARBURANT ====================

export const getAllPleinsCarburant = async () => {
  const response = await fetch(`${API_URL}/pleins-carburant`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

// Statut Trajet Enum
export const STATUT_TRAJET = {
  PLANIFIE: "PLANIFIE",
  EN_COURS: "EN_COURS",
  TERMINE: "TERMINE",
  ANNULE: "ANNULE",
  RETARDE: "RETARDE",
};

export const STATUT_TRAJET_LABELS = {
  PLANIFIE: "Planifié",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
  RETARDE: "Retardé",
};
