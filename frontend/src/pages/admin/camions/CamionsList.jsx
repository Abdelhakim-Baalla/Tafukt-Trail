import { useState, useEffect } from 'react';
import {
  getAllCamions,
  createCamion,
  updateCamion,
  deleteCamion,
  STATUT_VEHICULE,
  TYPE_CARBURANT,
  STATUT_VEHICULE_LABELS,
  TYPE_CARBURANT_LABELS
} from '../../../services/vehicules';
import '../vehicules.css';

// Icônes SVG
const Icons = {
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>,
  x: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  truck: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 17h4V5H2v12h3m15-5h2v5h-2M7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/><path d="M14 17V5h5l3 5v7"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
};

const CamionsList = () => {
  const [camions, setCamions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCamion, setEditingCamion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [formData, setFormData] = useState({
    marque: '',
    model: '',
    annee: new Date().getFullYear(),
    matricule: '',
    typeCarburant: 'DIESEL',
    reservoire: 0,
    statut: 'DISPONIBLE'
  });

  useEffect(() => {
    fetchCamions();
  }, []);

  const fetchCamions = async () => {
    try {
      const data = await getAllCamions();
      setCamions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCamion) {
        await updateCamion(editingCamion._id, formData);
      } else {
        await createCamion(formData);
      }
      fetchCamions();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce camion ?')) {
      try {
        await deleteCamion(id);
        fetchCamions();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const openModal = (camion = null) => {
    if (camion) {
      setEditingCamion(camion);
      setFormData({
        marque: camion.marque,
        model: camion.model,
        annee: camion.annee,
        matricule: camion.matricule,
        typeCarburant: camion.typeCarburant,
        reservoire: camion.reservoire,
        statut: camion.statut
      });
    } else {
      setEditingCamion(null);
      setFormData({
        marque: '',
        model: '',
        annee: new Date().getFullYear(),
        matricule: '',
        typeCarburant: 'DIESEL',
        reservoire: 0,
        statut: 'DISPONIBLE'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCamion(null);
  };

  const filteredCamions = camions.filter(c => {
    const matchSearch = c.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = !filterStatut || c.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const getStatutClass = (statut) => {
    switch (statut) {
      case 'DISPONIBLE': return 'status-ok';
      case 'EN_MISSION': return 'status-busy';
      case 'EN_MAINTENANCE': return 'status-warning';
      case 'HORS_SERVICE': return 'status-danger';
      default: return 'status-default';
    }
  };

  if (loading) {
    return <div className="page-loading"><div className="loader"></div></div>;
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-left">
          <h1>{Icons.truck} Camions</h1>
          <p>{camions.length} véhicule{camions.length > 1 ? 's' : ''} enregistré{camions.length > 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          {Icons.plus} <span>Ajouter</span>
        </button>
      </header>

      {/* Filtres */}
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
            {Object.entries(STATUT_VEHICULE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste */}
      {filteredCamions.length > 0 ? (
        <div className="cards-grid">
          {filteredCamions.map((camion) => (
            <div className="card" key={camion._id}>
              <div className="card-header">
                <div className="card-title">
                  <span className="card-matricule">{camion.matricule}</span>
                  <span className={`status ${getStatutClass(camion.statut)}`}>
                    {STATUT_VEHICULE_LABELS[camion.statut]}
                  </span>
                </div>
                <div className="card-actions">
                  <button className="btn-icon" onClick={() => openModal(camion)}>{Icons.edit}</button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(camion._id)}>{Icons.trash}</button>
                </div>
              </div>
              <div className="card-body">
                <div className="card-info">
                  <span className="info-label">Marque</span>
                  <span className="info-value">{camion.marque} {camion.model}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">Année</span>
                  <span className="info-value">{camion.annee}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">Carburant</span>
                  <span className="info-value">{TYPE_CARBURANT_LABELS[camion.typeCarburant]}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">Réservoir</span>
                  <span className="info-value">{camion.reservoire} L</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Aucun camion trouvé</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            {Icons.plus} Ajouter un camion
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCamion ? 'Modifier le camion' : 'Nouveau camion'}</h2>
              <button className="btn-icon" onClick={closeModal}>{Icons.x}</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Matricule *</label>
                  <input
                    type="text"
                    value={formData.matricule}
                    onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                    required
                    placeholder="AB-123-CD"
                  />
                </div>
                <div className="form-group">
                  <label>Marque *</label>
                  <input
                    type="text"
                    value={formData.marque}
                    onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                    required
                    placeholder="Volvo, Scania..."
                  />
                </div>
                <div className="form-group">
                  <label>Modèle *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                    placeholder="FH16, R500..."
                  />
                </div>
                <div className="form-group">
                  <label>Année *</label>
                  <input
                    type="number"
                    value={formData.annee}
                    onChange={(e) => setFormData({ ...formData, annee: parseInt(e.target.value) })}
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div className="form-group">
                  <label>Type carburant *</label>
                  <select
                    value={formData.typeCarburant}
                    onChange={(e) => setFormData({ ...formData, typeCarburant: e.target.value })}
                  >
                    {Object.entries(TYPE_CARBURANT_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Réservoir (L) *</label>
                  <input
                    type="number"
                    value={formData.reservoire}
                    onChange={(e) => setFormData({ ...formData, reservoire: parseInt(e.target.value) })}
                    required
                    min="0"
                  />
                </div>
                {editingCamion && (
                  <div className="form-group full-width">
                    <label>Statut</label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    >
                      {Object.entries(STATUT_VEHICULE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn btn-primary">
                  {editingCamion ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CamionsList;