import { useState, useEffect } from 'react';
import { 
  getAllPneus, 
  createPneu, 
  updatePneu, 
  deletePneu,
  getAllCamions,
  POSITION_PNEU,
  POSITION_PNEU_LABELS
} from '../../../services/vehicules';
import '../vehicules.css';

// SVG Icons
const Icons = {
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  x: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  tire: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  truck: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const PneusList = () => {
  const [pneus, setPneus] = useState([]);
  const [camions, setCamions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPneu, setEditingPneu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterCamion, setFilterCamion] = useState('');
  const [formData, setFormData] = useState({
    numeroSerie: '',
    marque: '',
    modele: '',
    dimension: '',
    position: POSITION_PNEU.AVANT_GAUCHE,
    datePose: '',
    pressionRecommandee: '',
    camion: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [pneusData, camionsData] = await Promise.all([
        getAllPneus(),
        getAllCamions()
      ]);
      setPneus(pneusData);
      setCamions(camionsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(error.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.camion) delete dataToSend.camion;
      
      if (editingPneu) {
        await updatePneu(editingPneu._id, dataToSend);
      } else {
        await createPneu(dataToSend);
      }
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setError(error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce pneu ?')) {
      try {
        setError(null);
        await deletePneu(id);
        fetchData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const openModal = (pneu = null) => {
    setError(null);
    if (pneu) {
      setEditingPneu(pneu);
      setFormData({
        numeroSerie: pneu.numeroSerie,
        marque: pneu.marque,
        modele: pneu.modele || '',
        dimension: pneu.dimension || '',
        position: pneu.position,
        datePose: pneu.datePose ? pneu.datePose.split('T')[0] : '',
        pressionRecommandee: pneu.pressionRecommandee || '',
        camion: pneu.camion?._id || pneu.camion || ''
      });
    } else {
      setEditingPneu(null);
      setFormData({
        numeroSerie: '',
        marque: '',
        modele: '',
        dimension: '',
        position: POSITION_PNEU.AVANT_GAUCHE,
        datePose: '',
        pressionRecommandee: '',
        camion: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPneu(null);
  };

  const getCamionLabel = (pneu) => {
    if (!pneu.camion) return 'Non assigné';
    if (typeof pneu.camion === 'object') {
      return pneu.camion.matricule || 'Camion';
    }
    const camion = camions.find(c => c._id === pneu.camion);
    return camion?.matricule || 'Camion';
  };

  const filteredPneus = pneus.filter(p => {
    const matchSearch = p.numeroSerie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.modele?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPosition = !filterPosition || p.position === filterPosition;
    const matchCamion = !filterCamion || 
      (p.camion?._id === filterCamion) || 
      (p.camion === filterCamion) ||
      (!filterCamion && !p.camion);
    return matchSearch && matchPosition && matchCamion;
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
          <h1>{Icons.tire} Gestion des Pneus</h1>
          <p>{pneus.length} pneu{pneus.length > 1 ? 's' : ''} au total</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          {Icons.plus}
          <span>Nouveau Pneu</span>
        </button>
      </div>

      <div className="filters">
        <div className="search-box">
          {Icons.search}
          <input
            type="text"
            placeholder="Rechercher par n° série, marque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          {Icons.filter}
          <select value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)}>
            <option value="">Toutes positions</option>
            {Object.entries(POSITION_PNEU_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          {Icons.truck}
          <select value={filterCamion} onChange={(e) => setFilterCamion(e.target.value)}>
            <option value="">Tous les camions</option>
            {camions.map(c => (
              <option key={c._id} value={c._id}>{c.matricule}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredPneus.length === 0 ? (
        <div className="empty-state">
          <p>Aucun pneu trouvé</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            {Icons.plus} Ajouter un pneu
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredPneus.map((pneu) => (
            <div className="card" key={pneu._id}>
              <div className="card-header">
                <div className="card-title">
                  <span className="card-matricule">{pneu.numeroSerie}</span>
                  <span className="tag">{POSITION_PNEU_LABELS[pneu.position]}</span>
                </div>
                <div className="card-actions">
                  <button className="btn-icon" onClick={() => openModal(pneu)} title="Modifier">
                    {Icons.edit}
                  </button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(pneu._id)} title="Supprimer">
                    {Icons.trash}
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="card-info">
                  <span className="info-label">Marque</span>
                  <span className="info-value">{pneu.marque}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">Modèle</span>
                  <span className="info-value">{pneu.modele || '-'}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">Dimension</span>
                  <span className="info-value">{pneu.dimension || '-'}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">Pression rec.</span>
                  <span className="info-value">{pneu.pressionRecommandee ? `${pneu.pressionRecommandee} bar` : '-'}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">Date pose</span>
                  <span className="info-value">{formatDate(pneu.datePose)}</span>
                </div>
                <div className="card-info">
                  <span className="info-label">Camion</span>
                  <span className="info-value">{getCamionLabel(pneu)}</span>
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
              <h2>{editingPneu ? 'Modifier le pneu' : 'Nouveau pneu'}</h2>
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
                  <label>Numéro de série *</label>
                  <input
                    type="text"
                    value={formData.numeroSerie}
                    onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })}
                    required
                    placeholder="PN-2024-001"
                  />
                </div>
                <div className="form-group">
                  <label>Marque *</label>
                  <input
                    type="text"
                    value={formData.marque}
                    onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                    required
                    placeholder="Michelin"
                  />
                </div>
                <div className="form-group">
                  <label>Modèle</label>
                  <input
                    type="text"
                    value={formData.modele}
                    onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                    placeholder="X Multi D"
                  />
                </div>
                <div className="form-group">
                  <label>Dimension</label>
                  <input
                    type="text"
                    value={formData.dimension}
                    onChange={(e) => setFormData({ ...formData, dimension: e.target.value })}
                    placeholder="315/80 R22.5"
                  />
                </div>
                <div className="form-group">
                  <label>Position *</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  >
                    {Object.entries(POSITION_PNEU_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Pression recommandée (bar)</label>
                  <input
                    type="number"
                    value={formData.pressionRecommandee}
                    onChange={(e) => setFormData({ ...formData, pressionRecommandee: e.target.value })}
                    step="0.1"
                    min="0"
                    placeholder="8.5"
                  />
                </div>
                <div className="form-group">
                  <label>Date de pose</label>
                  <input
                    type="date"
                    value={formData.datePose}
                    onChange={(e) => setFormData({ ...formData, datePose: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Camion assigné</label>
                  <select
                    value={formData.camion}
                    onChange={(e) => setFormData({ ...formData, camion: e.target.value })}
                  >
                    <option value="">Aucun</option>
                    {camions.map(c => (
                      <option key={c._id} value={c._id}>{c.matricule} - {c.marque} {c.model}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPneu ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PneusList;