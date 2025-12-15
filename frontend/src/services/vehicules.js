const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Helper pour gérer les réponses et erreurs
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Erreur ${response.status}`);
  }
  return data;
};

// ==================== CAMIONS ====================

export const getAllCamions = async () => {
  const response = await fetch(`${API_URL}/camions`, { headers: getHeaders() });
  return handleResponse(response);
};

export const getCamionById = async (id) => {
  const response = await fetch(`${API_URL}/camions/${id}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const getCamionsByStatut = async (statut) => {
  const response = await fetch(`${API_URL}/camions/statut/${statut}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const createCamion = async (data) => {
  const response = await fetch(`${API_URL}/camions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateCamion = async (id, data) => {
  const response = await fetch(`${API_URL}/camions/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteCamion = async (id) => {
  const response = await fetch(`${API_URL}/camions/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Erreur ${response.status}`);
  }
  return { success: true };
};

// ==================== REMORQUES ====================

export const getAllRemorques = async () => {
  const response = await fetch(`${API_URL}/remorques`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const getRemorqueById = async (id) => {
  const response = await fetch(`${API_URL}/remorques/${id}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const getRemorquesByStatut = async (statut) => {
  const response = await fetch(`${API_URL}/remorques/statut/${statut}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const createRemorque = async (data) => {
  const response = await fetch(`${API_URL}/remorques`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateRemorque = async (id, data) => {
  const response = await fetch(`${API_URL}/remorques/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteRemorque = async (id) => {
  const response = await fetch(`${API_URL}/remorques/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Erreur ${response.status}`);
  }
  return { success: true };
};

// ==================== PNEUS ====================

export const getAllPneus = async () => {
  const response = await fetch(`${API_URL}/pneus`, { headers: getHeaders() });
  return handleResponse(response);
};

export const getPneuById = async (id) => {
  const response = await fetch(`${API_URL}/pneus/${id}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const getPneusByPosition = async (position) => {
  const response = await fetch(`${API_URL}/pneus/position/${position}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const createPneu = async (data) => {
  const response = await fetch(`${API_URL}/pneus`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updatePneu = async (id, data) => {
  const response = await fetch(`${API_URL}/pneus/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deletePneu = async (id) => {
  const response = await fetch(`${API_URL}/pneus/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Erreur ${response.status}`);
  }
  return { success: true };
};

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
  return handleResponse(response);
};

export const getTrajetById = async (id) => {
  const response = await fetch(`${API_URL}/trajets/${id}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const getTrajetsByChauffeur = async (chauffeurId) => {
  const response = await fetch(`${API_URL}/trajets/chauffeur/${chauffeurId}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const getTrajetsByStatut = async (statut) => {
  const response = await fetch(`${API_URL}/trajets/statut/${statut}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const createTrajet = async (data) => {
  const response = await fetch(`${API_URL}/trajets`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateTrajet = async (id, data) => {
  const response = await fetch(`${API_URL}/trajets/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateTrajetStatut = async (id, statut) => {
  const response = await fetch(`${API_URL}/trajets/${id}/statut`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ statut }),
  });
  return handleResponse(response);
};

export const deleteTrajet = async (id) => {
  const response = await fetch(`${API_URL}/trajets/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Erreur ${response.status}`);
  }
  return { success: true };
};

export const getTrajetPdf = async (id) => {
  const response = await fetch(`${API_URL}/trajets/${id}/pdf`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la génération du PDF");
  }
  return response.blob();
};

// ==================== CHAUFFEURS & USERS ====================

export const getAllChauffeurs = async () => {
  const response = await fetch(`${API_URL}/auth/chauffeurs`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des chauffeurs");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/auth/users`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

// ==================== PLEINS CARBURANT ====================

export const getAllPleinsCarburant = async () => {
  const response = await fetch(`${API_URL}/pleins-carburant`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des pleins carburant");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

// ==================== MAINTENANCE - INTERVENTIONS ====================

export const getAllInterventions = async () => {
  const response = await fetch(`${API_URL}/maintenance/interventions`, {
    headers: getHeaders(),
  });
  if (!response.ok)
    throw new Error("Erreur lors de la récupération des interventions");
  return response.json();
};

export const getInterventionById = async (id) => {
  const response = await fetch(`${API_URL}/maintenance/interventions/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok)
    throw new Error("Erreur lors de la récupération de l'intervention");
  return response.json();
};

export const getInterventionsByCamion = async (camionId) => {
  const response = await fetch(
    `${API_URL}/maintenance/interventions/camion/${camionId}`,
    {
      headers: getHeaders(),
    }
  );
  if (!response.ok)
    throw new Error("Erreur lors de la récupération des interventions");
  return response.json();
};

export const createIntervention = async (data) => {
  const response = await fetch(`${API_URL}/maintenance/interventions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok)
    throw new Error("Erreur lors de la création de l'intervention");
  return response.json();
};

export const updateIntervention = async (id, data) => {
  const response = await fetch(`${API_URL}/maintenance/interventions/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok)
    throw new Error("Erreur lors de la mise à jour de l'intervention");
  return response.json();
};

export const deleteIntervention = async (id) => {
  const response = await fetch(`${API_URL}/maintenance/interventions/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok)
    throw new Error("Erreur lors de la suppression de l'intervention");
  return response.json();
};

export const getAllRegles = async () => {
  const response = await fetch(`${API_URL}/maintenance/regles`, {
    headers: getHeaders(),
  });
  if (!response.ok)
    throw new Error("Erreur lors de la récupération des règles");
  return response.json();
};

export const getRegleById = async (id) => {
  const response = await fetch(`${API_URL}/maintenance/regles/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok)
    throw new Error("Erreur lors de la récupération de la règle");
  return response.json();
};

export const createRegle = async (data) => {
  const response = await fetch(`${API_URL}/maintenance/regles`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erreur lors de la création de la règle");
  return response.json();
};

export const updateRegle = async (id, data) => {
  const response = await fetch(`${API_URL}/maintenance/regles/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok)
    throw new Error("Erreur lors de la mise à jour de la règle");
  return response.json();
};

export const deleteRegle = async (id) => {
  const response = await fetch(`${API_URL}/maintenance/regles/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok)
    throw new Error("Erreur lors de la suppression de la règle");
  return response.json();
};

export const getMaintenanceAlertes = async () => {
  const response = await fetch(`${API_URL}/maintenance/alertes`, {
    headers: getHeaders(),
  });
  if (!response.ok)
    throw new Error("Erreur lors de la récupération des alertes");
  return response.json();
};

export const planifierMaintenance = async (data) => {
  const response = await fetch(`${API_URL}/maintenance/planifier`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erreur lors de la planification");
  return response.json();
};

// Types de maintenance enum
export const TYPE_MAINTENANCE = {
  VIDANGE: "VIDANGE",
  REVISION: "REVISION",
  CHANGEMENT_PNEUS: "CHANGEMENT_PNEUS",
  FREINS: "FREINS",
  ELECTRIQUE: "ELECTRIQUE",
  CARROSSERIE: "CARROSSERIE",
  CONTROLE_TECHNIQUE: "CONTROLE_TECHNIQUE",
};

export const TYPE_MAINTENANCE_LABELS = {
  VIDANGE: "Vidange",
  REVISION: "Révision",
  CHANGEMENT_PNEUS: "Changement de pneus",
  FREINS: "Freins",
  ELECTRIQUE: "Électrique",
  CARROSSERIE: "Carrosserie",
  CONTROLE_TECHNIQUE: "Contrôle technique",
};

// Types de véhicule enum (pour RegleMaintenance)
export const TYPE_VEHICULE = {
  CAMION: "CAMION",
  REMORQUE: "REMORQUE",
};

export const TYPE_VEHICULE_LABELS = {
  CAMION: "Camion",
  REMORQUE: "Remorque",
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
