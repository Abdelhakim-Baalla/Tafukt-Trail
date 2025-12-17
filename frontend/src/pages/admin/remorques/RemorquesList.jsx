import { useState, useEffect } from 'react';
import { 
  getAllRemorques, 
  createRemorque, 
  updateRemorque, 
  deleteRemorque,
  STATUT_VEHICULE,
  STATUT_VEHICULE_LABELS,
  TYPE_REMORQUE,
  TYPE_REMORQUE_LABELS
} from '../../../services/vehicules';
import '../vehicules.css';

// SVG Icons
const Icons = {
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  x: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  trailer: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="15" height="10" rx="1"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><path d="M16 10h4l3 4v4h-7"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

const getStatusClass = (statut) => {
  switch (statut) {
    case STATUT_VEHICULE.DISPONIBLE: return 'status-ok';
    case STATUT_VEHICULE.EN_MISSION: return 'status-busy';
    case STATUT_VEHICULE.EN_MAINTENANCE: return 'status-warning';
    case STATUT_VEHICULE.HORS_SERVICE: return 'status-danger';
    case STATUT_VEHICULE.RESERVE: return 'status-default';
    default: return 'status-default';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const RemorquesList = () => {
  const [remorques, setRemorques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRemorque, setEditingRemorque] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterType, setFilterType] = useState('');
  const [formData, setFormData] = useState({
    type: TYPE_REMORQUE.FOURGON,
    capaciteTonnes: '',
    matricule: '',
    statut: STATUT_VEHICULE.DISPONIBLE,
    dateDernierVerification: ''
  });

  useEffect(() => {
    fetchRemorques();
  }, []);

  const fetchRemorques = async () => {
    try {
      setError(null);
      const data = await getAllRemorques();
      setRemorques(data);
    } catch (error) {
      console.error('Erreur lors du chargement des remorques:', error);
      setError(error.message || 'Erreur lors du chargement des remorques');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingRemorque) {
        await updateRemorque(editingRemorque._id, formData);
      } else {
        await createRemorque(formData);
      }
      fetchRemorques();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setError(error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette remorque ?')) {
      try {
        setError(null);
        await deleteRemorque(id);
        fetchRemorques();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const openModal = (remorque = null) => {
    setError(null);
    if (remorque) {
      setEditingRemorque(remorque);
      setFormData({
        type: remorque.type,
        capaciteTonnes: remorque.capaciteTonnes,
        matricule: remorque.matricule,
        statut: remorque.statut,
        dateDernierVerification: remorque.dateDernierVerification ? 
          remorque.dateDernierVerification.split('T')[0] : ''
      });
    } else {
      setEditingRemorque(null);
      setFormData({
        type: TYPE_REMORQUE.FOURGON,
        capaciteTonnes: '',
        matricule: '',
        statut: STATUT_VEHICULE.DISPONIBLE,
        dateDernierVerification: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRemorque(null);
  };

  const filteredRemorques = remorques.filter(r => {
    const matchSearch = r.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       TYPE_REMORQUE_LABELS[r.type]?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = !filterStatut || r.statut === filterStatut;
    const matchType = !filterType || r.type === filterType;
    return matchSearch && matchStatut && matchType;
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
      {error && (
        <div className="alert alert-error" style={{margin: '1rem 0', padding: '0.75rem 1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', border: '1px solid #fecaca'}}>
          {error}
          <button onClick={() => setError(null)} style={{marginLeft: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}>×</button>
        </div>
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h1>{Icons.trailer} Gestion des Remorques</h1>
          <p>{remorques.length} remorque{remorques.length > 1 ? 's' : ''} au total</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          {Icons.plus}
          <span>Nouvelle Remorque</span>
        </button>
      </div>

      <div className="filters">
        <div className="search-box">
          {Icons.search}
          <input
            type="text"
            placeholder="Rechercher par matricule, type..."
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
        <div className="filter-group">
          {Icons.filter}
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Tous les types</option>
            {Object.entries(TYPE_REMORQUE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredRemorques.length === 0 ? (
        <div className="empty-state">
          <p>Aucune remorque trouvée</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            {Icons.plus} Ajouter une remorque
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredRemorques.map((remorque) => (
            <div className="card" key={remorque._id}>
              <div className="card-header">
                <div className="card-title">
                  <span className="card-matricule">{remorque.matricule}</span>
                  <span className={`status ${getStatusClass(remorque.statut)}`}>
                    {STATUT_VEHICULE_LABELS[remorque.statut]}
                  </span>
                </div>
                <div className="card-actions">
                  <button className="btn-icon" onClick={() => openModal(remorque)} title="Modifier">
                    {Icons.edit}
                  </button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(remorque._id)} title="Supprimer">
                    {Icons.trash}
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="card-info">
                  <span className="info-label">Type</span>
                  <span className="info-value">{TYPE_REMORQUE_LABELS[remorque.type]}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">Capacité</span>
                  <span className="info-value">{remorque.capaciteTonnes} T</span>
                </div>
                <div className="card-info">
                  <span className="info-label">Dernière vérif.</span>
                  <span className="info-value">{formatDate(remorque.dateDernierVerification)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRemorque ? 'Modifier la remorque' : 'Nouvelle remorque'}</h2>
              <button className="btn-icon" onClick={closeModal}>{Icons.x}</button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-error" style={{margin: '0 0 1rem 0', padding: '0.75rem 1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', border: '1px solid #fecaca'}}>
                  {error}
                </div>
              )}
              <div className="form-grid">
                <div className="form-group">
                  <label>Matricule *</label>
                  <input
                    type="text"
                    value={formData.matricule}
                    onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                    required
                    placeholder="ABC-123-XY"
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    {Object.entries(TYPE_REMORQUE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacité (tonnes) *</label>
                  <input
                    type="number"
                    value={formData.capaciteTonnes}
                    onChange={(e) => setFormData({ ...formData, capaciteTonnes: e.target.value })}
                    required
                    min="0"
                    step="0.1"
                    placeholder="25"
                  />
                </div>
                <div className="form-group">
                  <label>Statut *</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    required
                  >
                    {Object.entries(STATUT_VEHICULE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Date dernière vérification</label>
                  <input
                    type="date"
                    value={formData.dateDernierVerification}
                    onChange={(e) => setFormData({ ...formData, dateDernierVerification: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRemorque ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemorquesList;