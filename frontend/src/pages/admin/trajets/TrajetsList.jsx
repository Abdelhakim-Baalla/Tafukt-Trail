import { useState, useEffect } from 'react';
import {
  getAllTrajets,
  createTrajet,
  updateTrajet,
  deleteTrajet,
  updateTrajetStatut,
  getAllCamions,
  getAllRemorques,
  getAllChauffeurs,
  STATUT_TRAJET,
  STATUT_TRAJET_LABELS
} from '../../../services/vehicules';
import '../vehicules.css';

// SVG Icons
const Icons = {
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  x: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  route: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  mapPin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  truck: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  user: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  play: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

const getStatusClass = (statut) => {
  switch (statut) {
    case STATUT_TRAJET.PLANIFIE: return 'status-default';
    case STATUT_TRAJET.EN_COURS: return 'status-busy';
    case STATUT_TRAJET.TERMINE: return 'status-ok';
    case STATUT_TRAJET.ANNULE: return 'status-danger';
    case STATUT_TRAJET.RETARDE: return 'status-warning';
    default: return 'status-default';
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const TrajetsList = () => {
  const [trajets, setTrajets] = useState([]);
  const [camions, setCamions] = useState([]);
  const [remorques, setRemorques] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTrajet, setEditingTrajet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [formData, setFormData] = useState({
    camion: '',
    chauffeur: '',
    remorque: '',
    lieuDepart: '',
    lieuArrivee: '',
    dateHeureDepart: '',
    dateHeureArrivee: '',
    kilometrageDepart: '',
    kilometrageArrivee: '',
    carburantNiveauxDepart: '',
    carburantNiveauxArrivee: '',
    statut: STATUT_TRAJET.PLANIFIE,
    notesAdministratives: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [trajetsRes, camionsRes, remorquesRes, chauffeursRes] = await Promise.all([
        getAllTrajets(),
        getAllCamions(),
        getAllRemorques(),
        getAllChauffeurs()
      ]);
      
      console.log('Trajets:', trajetsRes);
      console.log('Camions:', camionsRes);
      console.log('Remorques:', remorquesRes);
      console.log('Chauffeurs:', chauffeursRes);
      
      // Ensure we always have arrays
      const trajetsArray = Array.isArray(trajetsRes) ? trajetsRes : (trajetsRes?.trajets || []);
      const camionsArray = Array.isArray(camionsRes) ? camionsRes : (camionsRes?.camions || []);
      const remorquesArray = Array.isArray(remorquesRes) ? remorquesRes : (remorquesRes?.remorques || []);
      const chauffeursArray = Array.isArray(chauffeursRes) ? chauffeursRes : (chauffeursRes?.chauffeurs || []);
      
      setTrajets(trajetsArray);
      setCamions(camionsArray);
      setRemorques(remorquesArray);
      setChauffeurs(chauffeursArray);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const dataToSend = { 
        ...formData,
        kilometrageDepart: Number(formData.kilometrageDepart),
        carburantNiveauxDepart: Number(formData.carburantNiveauxDepart)
      };
      
      if (!dataToSend.remorque) delete dataToSend.remorque;
      if (!dataToSend.dateHeureArrivee) delete dataToSend.dateHeureArrivee;
      if (!dataToSend.kilometrageArrivee) delete dataToSend.kilometrageArrivee;
      else dataToSend.kilometrageArrivee = Number(dataToSend.kilometrageArrivee);
      if (!dataToSend.carburantNiveauxArrivee) delete dataToSend.carburantNiveauxArrivee;
      else dataToSend.carburantNiveauxArrivee = Number(dataToSend.carburantNiveauxArrivee);
      
      let result;
      if (editingTrajet) {
        result = await updateTrajet(editingTrajet._id, dataToSend);
      } else {
        result = await createTrajet(dataToSend);
      }
      
      if (result.message && !result._id) {
        setError(result.message);
        return;
      }
      
      fetchData();
      closeModal();
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      try {
        await deleteTrajet(id);
        fetchData();
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleStatusChange = async (id, newStatut) => {
    try {
      await updateTrajetStatut(id, newStatut);
      fetchData();
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const openModal = (trajet = null) => {
    setError(null);
    if (trajet) {
      setEditingTrajet(trajet);
      setFormData({
        camion: trajet.camion?._id || trajet.camion || '',
        chauffeur: trajet.chauffeur?._id || trajet.chauffeur || '',
        remorque: trajet.remorque?._id || trajet.remorque || '',
        lieuDepart: trajet.lieuDepart || '',
        lieuArrivee: trajet.lieuArrivee || '',
        dateHeureDepart: trajet.dateHeureDepart ? trajet.dateHeureDepart.slice(0, 16) : '',
        dateHeureArrivee: trajet.dateHeureArrivee ? trajet.dateHeureArrivee.slice(0, 16) : '',
        kilometrageDepart: trajet.kilometrageDepart || '',
        kilometrageArrivee: trajet.kilometrageArrivee || '',
        carburantNiveauxDepart: trajet.carburantNiveauxDepart || '',
        carburantNiveauxArrivee: trajet.carburantNiveauxArrivee || '',
        statut: trajet.statut || STATUT_TRAJET.PLANIFIE,
        notesAdministratives: trajet.notesAdministratives || ''
      });
    } else {
      setEditingTrajet(null);
      setFormData({
        camion: '',
        chauffeur: '',
        remorque: '',
        lieuDepart: '',
        lieuArrivee: '',
        dateHeureDepart: '',
        dateHeureArrivee: '',
        kilometrageDepart: '',
        kilometrageArrivee: '',
        carburantNiveauxDepart: '',
        carburantNiveauxArrivee: '',
        statut: STATUT_TRAJET.PLANIFIE,
        notesAdministratives: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTrajet(null);
    setError(null);
  };

  const getCamionLabel = (trajet) => {
    if (!trajet.camion) return '-';
    if (typeof trajet.camion === 'object') return trajet.camion.matricule;
    const c = camions.find(cam => cam._id === trajet.camion);
    return c?.matricule || '-';
  };

  const getChauffeurLabel = (trajet) => {
    if (!trajet.chauffeur) return '-';
    if (typeof trajet.chauffeur === 'object') {
      return `${trajet.chauffeur.prenom || ''} ${trajet.chauffeur.nom || ''}`.trim() || '-';
    }
    const ch = chauffeurs.find(c => c._id === trajet.chauffeur);
    return ch ? `${ch.prenom || ''} ${ch.nom || ''}`.trim() : '-';
  };

  const filteredTrajets = trajets.filter(t => {
    const matchSearch = 
      t.lieuDepart?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lieuArrivee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCamionLabel(t).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getChauffeurLabel(t).toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = !filterStatut || t.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  if (loading) {
    return (
      <div className="page page-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>{Icons.route} Gestion des Trajets</h1>
          <p>{trajets.length} trajet{trajets.length > 1 ? 's' : ''} au total</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          {Icons.plus}
          <span>Nouveau Trajet</span>
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          {Icons.search}
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          {Icons.filter}
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            {Object.entries(STATUT_TRAJET_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && <div className="error-banner">{error}</div>}

      {/* Cards */}
      {filteredTrajets.length === 0 ? (
        <div className="empty-state">
          <p>Aucun trajet trouvé</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            {Icons.plus} Planifier un trajet
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredTrajets.map((trajet) => (
            <div className="card" key={trajet._id}>
              <div className="card-header">
                <div className="card-title">
                  <div className="trajet-route">
                    <span className="trajet-lieu">{Icons.mapPin} {trajet.lieuDepart}</span>
                    <span className="trajet-arrow">{Icons.arrow}</span>
                    <span className="trajet-lieu">{Icons.mapPin} {trajet.lieuArrivee}</span>
                  </div>
                  <span className={`status ${getStatusClass(trajet.statut)}`}>
                    {STATUT_TRAJET_LABELS[trajet.statut]}
                  </span>
                </div>
                <div className="card-actions">
                  <button className="btn-icon" onClick={() => openModal(trajet)}>{Icons.edit}</button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(trajet._id)}>{Icons.trash}</button>
                </div>
              </div>
              <div className="card-body">
                <div className="card-info">
                  <span className="info-label">{Icons.calendar} Départ</span>
                  <span className="info-value">{formatDateTime(trajet.dateHeureDepart)}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">{Icons.truck} Camion</span>
                  <span className="info-value">{getCamionLabel(trajet)}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">{Icons.user} Chauffeur</span>
                  <span className="info-value">{getChauffeurLabel(trajet)}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">Km</span>
                  <span className="info-value">{trajet.kilometrageDepart?.toLocaleString() || '-'}</span>
                </div>
              </div>
              {trajet.statut === STATUT_TRAJET.PLANIFIE && (
                <div className="card-footer">
                  <button className="btn btn-sm btn-primary" onClick={() => handleStatusChange(trajet._id, STATUT_TRAJET.EN_COURS)}>
                    {Icons.play} Démarrer
                  </button>
                </div>
              )}
              {trajet.statut === STATUT_TRAJET.EN_COURS && (
                <div className="card-footer">
                  <button className="btn btn-sm btn-primary" onClick={() => handleStatusChange(trajet._id, STATUT_TRAJET.TERMINE)}>
                    {Icons.check} Terminer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTrajet ? 'Modifier le trajet' : 'Nouveau trajet'}</h2>
              <button className="btn-icon" onClick={closeModal}>{Icons.x}</button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && <div className="form-error">{error}</div>}
              <div className="form-grid">
                <div className="form-group">
                  <label>Lieu de départ *</label>
                  <input
                    type="text"
                    value={formData.lieuDepart}
                    onChange={(e) => setFormData({ ...formData, lieuDepart: e.target.value })}
                    required
                    placeholder="Casablanca"
                  />
                </div>
                <div className="form-group">
                  <label>Lieu d'arrivée *</label>
                  <input
                    type="text"
                    value={formData.lieuArrivee}
                    onChange={(e) => setFormData({ ...formData, lieuArrivee: e.target.value })}
                    required
                    placeholder="Rabat"
                  />
                </div>
                <div className="form-group">
                  <label>Date/heure départ *</label>
                  <input
                    type="datetime-local"
                    value={formData.dateHeureDepart}
                    onChange={(e) => setFormData({ ...formData, dateHeureDepart: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date/heure arrivée</label>
                  <input
                    type="datetime-local"
                    value={formData.dateHeureArrivee}
                    onChange={(e) => setFormData({ ...formData, dateHeureArrivee: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Camion * ({camions.filter(c => c.statut === 'DISPONIBLE' || editingTrajet).length} disponibles)</label>
                  <select
                    value={formData.camion}
                    onChange={(e) => setFormData({ ...formData, camion: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner un camion</option>
                    {camions.map(c => (
                      <option 
                        key={c._id} 
                        value={c._id}
                        disabled={!editingTrajet && c.statut !== 'DISPONIBLE'}
                      >
                        {c.matricule} - {c.marque} {c.modele || c.model} {c.statut !== 'DISPONIBLE' ? `(${c.statut})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Chauffeur * ({chauffeurs.filter(ch => ch.statut === 'DISPONIBLE' || editingTrajet).length} disponibles)</label>
                  <select
                    value={formData.chauffeur}
                    onChange={(e) => setFormData({ ...formData, chauffeur: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner un chauffeur</option>
                    {chauffeurs.map(ch => (
                      <option 
                        key={ch._id} 
                        value={ch._id}
                        disabled={!editingTrajet && ch.statut !== 'DISPONIBLE'}
                      >
                        {ch.prenom} {ch.nom} {ch.statut !== 'DISPONIBLE' ? `(${ch.statut})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Remorque ({remorques.filter(r => r.statut === 'DISPONIBLE' || editingTrajet).length} disponibles)</label>
                  <select
                    value={formData.remorque}
                    onChange={(e) => setFormData({ ...formData, remorque: e.target.value })}
                  >
                    <option value="">Aucune remorque</option>
                    {remorques.map(r => (
                      <option 
                        key={r._id} 
                        value={r._id}
                        disabled={!editingTrajet && r.statut !== 'DISPONIBLE'}
                      >
                        {r.matricule} {r.statut !== 'DISPONIBLE' ? `(${r.statut})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Km départ *</label>
                  <input
                    type="number"
                    value={formData.kilometrageDepart}
                    onChange={(e) => setFormData({ ...formData, kilometrageDepart: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Carburant départ (L) *</label>
                  <input
                    type="number"
                    value={formData.carburantNiveauxDepart}
                    onChange={(e) => setFormData({ ...formData, carburantNiveauxDepart: e.target.value })}
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>Km arrivée</label>
                  <input
                    type="number"
                    value={formData.kilometrageArrivee}
                    onChange={(e) => setFormData({ ...formData, kilometrageArrivee: e.target.value })}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Carburant arrivée (L)</label>
                  <input
                    type="number"
                    value={formData.carburantNiveauxArrivee}
                    onChange={(e) => setFormData({ ...formData, carburantNiveauxArrivee: e.target.value })}
                    min="0"
                    step="0.1"
                  />
                </div>
                {editingTrajet && (
                  <div className="form-group">
                    <label>Statut</label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    >
                      {Object.entries(STATUT_TRAJET_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    value={formData.notesAdministratives}
                    onChange={(e) => setFormData({ ...formData, notesAdministratives: e.target.value })}
                    rows="2"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn btn-primary">
                  {editingTrajet ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrajetsList;
