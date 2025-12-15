import { useState, useEffect } from 'react';
import { 
  getAllInterventions, createIntervention, updateIntervention, deleteIntervention,
  getAllRegles, createRegle, updateRegle, deleteRegle,
  getMaintenanceAlertes, planifierMaintenance,
  getAllCamions,
  TYPE_MAINTENANCE, TYPE_MAINTENANCE_LABELS,
  TYPE_VEHICULE, TYPE_VEHICULE_LABELS
} from '../../../services/vehicules';
import '../vehicules.css';
import './maintenance.css';

// SVG Icons
const Icons = {
  wrench: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  alert: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  truck: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3m15-5h2v5h-2M7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/><path d="M14 17V5h5l3 5v7"/></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  refresh: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  close: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  list: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
};

const MaintenanceList = () => {
  const [activeTab, setActiveTab] = useState('interventions');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [interventions, setInterventions] = useState([]);
  const [regles, setRegles] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [camions, setCamions] = useState([]);
  
  // UI states
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'intervention', 'regle', 'planifier'
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form states
  const [interventionForm, setInterventionForm] = useState({
    type: '',
    description: '',
    dateIntervention: '',
    cout: '',
    kilometrageVehicule: '',
    numeroFacture: '',
    camion: ''
  });

  const [regleForm, setRegleForm] = useState({
    typeVehicule: '',
    typeIntervention: '',
    intervalleKilometres: '',
    description: ''
  });

  const [planifierForm, setPlanifierForm] = useState({
    camionId: '',
    typeIntervention: '',
    datePrevu: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [interventionsRes, reglesRes, alertesRes, camionsRes] = await Promise.all([
        getAllInterventions().catch(() => []),
        getAllRegles().catch(() => []),
        getMaintenanceAlertes().catch(() => []),
        getAllCamions()
      ]);
      setInterventions(Array.isArray(interventionsRes) ? interventionsRes : []);
      setRegles(Array.isArray(reglesRes) ? reglesRes : []);
      setAlertes(Array.isArray(alertesRes) ? alertesRes : []);
      setCamions(Array.isArray(camionsRes) ? camionsRes : []);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // ==================== INTERVENTION HANDLERS ====================
  const openInterventionModal = (intervention = null) => {
    if (intervention) {
      setEditingItem(intervention);
      setInterventionForm({
        type: intervention.type || '',
        description: intervention.description || '',
        dateIntervention: intervention.dateIntervention ? intervention.dateIntervention.split('T')[0] : '',
        cout: intervention.cout || '',
        kilometrageVehicule: intervention.kilometrageVehicule || '',
        numeroFacture: intervention.numeroFacture || '',
        camion: intervention.camion?._id || intervention.camion || ''
      });
    } else {
      setEditingItem(null);
      setInterventionForm({
        type: '', description: '', dateIntervention: '', cout: '', 
        kilometrageVehicule: '', numeroFacture: '', camion: ''
      });
    }
    setModalType('intervention');
    setShowModal(true);
  };

  const handleInterventionSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = {
        ...interventionForm,
        cout: Number(interventionForm.cout),
        kilometrageVehicule: Number(interventionForm.kilometrageVehicule)
      };
      if (editingItem) {
        await updateIntervention(editingItem._id, data);
        setSuccessMessage('Intervention mise à jour avec succès');
      } else {
        await createIntervention(data);
        setSuccessMessage('Intervention créée avec succès');
      }
      setShowModal(false);
      fetchAllData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteIntervention = async (id) => {
    try {
      await deleteIntervention(id);
      setSuccessMessage('Intervention supprimée avec succès');
      setDeleteConfirm(null);
      fetchAllData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // ==================== REGLE HANDLERS ====================
  const openRegleModal = (regle = null) => {
    if (regle) {
      setEditingItem(regle);
      setRegleForm({
        typeVehicule: regle.typeVehicule || '',
        typeIntervention: regle.typeIntervention || '',
        intervalleKilometres: regle.intervalleKilometres || '',
        description: regle.description || ''
      });
    } else {
      setEditingItem(null);
      setRegleForm({
        typeVehicule: '', typeIntervention: '', intervalleKilometres: '', description: ''
      });
    }
    setModalType('regle');
    setShowModal(true);
  };

  const handleRegleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = {
        ...regleForm,
        intervalleKilometres: Number(regleForm.intervalleKilometres)
      };
      if (editingItem) {
        await updateRegle(editingItem._id, data);
        setSuccessMessage('Règle mise à jour avec succès');
      } else {
        await createRegle(data);
        setSuccessMessage('Règle créée avec succès');
      }
      setShowModal(false);
      fetchAllData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRegle = async (id) => {
    try {
      await deleteRegle(id);
      setSuccessMessage('Règle supprimée avec succès');
      setDeleteConfirm(null);
      fetchAllData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // ==================== PLANIFIER HANDLER ====================
  const openPlanifierModal = (alerte = null) => {
    if (alerte) {
      const camionObj = camions.find(c => c.matricule === alerte.camion);
      setPlanifierForm({
        camionId: camionObj?._id || alerte.camionId || '',
        typeIntervention: alerte.typeIntervention || '',
        datePrevu: new Date().toISOString().split('T')[0]
      });
    } else {
      setPlanifierForm({
        camionId: '', typeIntervention: '', datePrevu: new Date().toISOString().split('T')[0]
      });
    }
    setModalType('planifier');
    setShowModal(true);
  };

  const handlePlanifierSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await planifierMaintenance(planifierForm);
      setSuccessMessage('Maintenance planifiée avec succès');
      setShowModal(false);
      fetchAllData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Stats
  const urgentCount = alertes.filter(a => a.priorite === 'URGENT').length;

  if (loading) {
    return (
      <div className="page">
        <div className="page-loading">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>{Icons.wrench} Maintenance</h1>
            <p>Gestion des interventions, règles et alertes</p>
          </div>
          <div className="page-header-right">
            <button className="btn btn-secondary" onClick={fetchAllData}>
              {Icons.refresh} Actualiser
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{Icons.check} {successMessage}</div>}

        {/* Stats */}
        <div className="maintenance-stats">
          <div className="stat-card-mini stat-info">
            <div className="stat-mini-icon">{Icons.list}</div>
            <div className="stat-mini-content">
              <span className="stat-mini-value">{interventions.length}</span>
              <span className="stat-mini-label">Interventions</span>
            </div>
          </div>
          <div className="stat-card-mini stat-warning">
            <div className="stat-mini-icon">{Icons.settings}</div>
            <div className="stat-mini-content">
              <span className="stat-mini-value">{regles.length}</span>
              <span className="stat-mini-label">Règles</span>
            </div>
          </div>
          <div className="stat-card-mini stat-urgent">
            <div className="stat-mini-icon">{Icons.alert}</div>
            <div className="stat-mini-content">
              <span className="stat-mini-value">{urgentCount}</span>
              <span className="stat-mini-label">Alertes urgentes</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'interventions' ? 'active' : ''}`}
            onClick={() => setActiveTab('interventions')}
          >
            {Icons.list} Interventions ({interventions.length})
          </button>
          <button 
            className={`tab ${activeTab === 'regles' ? 'active' : ''}`}
            onClick={() => setActiveTab('regles')}
          >
            {Icons.settings} Règles ({regles.length})
          </button>
          <button 
            className={`tab ${activeTab === 'alertes' ? 'active' : ''}`}
            onClick={() => setActiveTab('alertes')}
          >
            {Icons.alert} Alertes ({alertes.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* ==================== INTERVENTIONS TAB ==================== */}
          {activeTab === 'interventions' && (
            <div className="section-card">
              <div className="section-header">
                <h2>{Icons.list} Interventions de maintenance</h2>
                <button className="btn btn-primary btn-sm" onClick={() => openInterventionModal()}>
                  {Icons.plus} Nouvelle intervention
                </button>
              </div>
              
              {interventions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{Icons.wrench}</div>
                  <h3>Aucune intervention</h3>
                  <p>Aucune intervention de maintenance enregistrée.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Camion</th>
                        <th>Kilométrage</th>
                        <th>Coût</th>
                        <th>N° Facture</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interventions.map((intervention) => (
                        <tr key={intervention._id}>
                          <td>{new Date(intervention.dateIntervention).toLocaleDateString('fr-FR')}</td>
                          <td>
                            <span className="badge badge-type">
                              {TYPE_MAINTENANCE_LABELS[intervention.type] || intervention.type}
                            </span>
                          </td>
                          <td>
                            <span className="matricule-badge">
                              {intervention.camion?.matricule || 'N/A'}
                            </span>
                          </td>
                          <td>{(intervention.kilometrageVehicule || 0).toLocaleString()} km</td>
                          <td className="text-bold">{(intervention.cout || 0).toLocaleString()} DH</td>
                          <td>{intervention.numeroFacture || '-'}</td>
                          <td>
                            <div className="actions">
                              <button className="btn-icon" title="Modifier" onClick={() => openInterventionModal(intervention)}>
                                {Icons.edit}
                              </button>
                              <button className="btn-icon btn-danger" title="Supprimer" onClick={() => setDeleteConfirm({ type: 'intervention', id: intervention._id })}>
                                {Icons.trash}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ==================== REGLES TAB ==================== */}
          {activeTab === 'regles' && (
            <div className="section-card">
              <div className="section-header">
                <h2>{Icons.settings} Règles de maintenance</h2>
                <button className="btn btn-primary btn-sm" onClick={() => openRegleModal()}>
                  {Icons.plus} Nouvelle règle
                </button>
              </div>
              
              {regles.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{Icons.settings}</div>
                  <h3>Aucune règle</h3>
                  <p>Aucune règle de maintenance configurée.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Type véhicule</th>
                        <th>Type intervention</th>
                        <th>Intervalle (km)</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regles.map((regle) => (
                        <tr key={regle._id}>
                          <td>
                            <span className="badge badge-vehicule">
                              {TYPE_VEHICULE_LABELS[regle.typeVehicule] || regle.typeVehicule}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-type">
                              {TYPE_MAINTENANCE_LABELS[regle.typeIntervention] || regle.typeIntervention}
                            </span>
                          </td>
                          <td className="text-bold">{(regle.intervalleKilometres || 0).toLocaleString()} km</td>
                          <td>{regle.description || '-'}</td>
                          <td>
                            <div className="actions">
                              <button className="btn-icon" title="Modifier" onClick={() => openRegleModal(regle)}>
                                {Icons.edit}
                              </button>
                              <button className="btn-icon btn-danger" title="Supprimer" onClick={() => setDeleteConfirm({ type: 'regle', id: regle._id })}>
                                {Icons.trash}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ==================== ALERTES TAB ==================== */}
          {activeTab === 'alertes' && (
            <div className="section-card">
              <div className="section-header">
                <h2>{Icons.alert} Alertes de maintenance préventive</h2>
                <button className="btn btn-primary btn-sm" onClick={() => openPlanifierModal()}>
                  {Icons.calendar} Planifier
                </button>
              </div>

              {alertes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{Icons.check}</div>
                  <h3>Aucune alerte</h3>
                  <p>Tous les véhicules sont à jour.</p>
                </div>
              ) : (
                <div className="alertes-grid">
                  {alertes.map((alerte, index) => (
                    <div 
                      key={index} 
                      className={`alerte-card ${alerte.priorite === 'URGENT' ? 'alerte-urgent' : 'alerte-normal'}`}
                    >
                      <div className="alerte-header">
                        <span className={`alerte-priorite ${alerte.priorite === 'URGENT' ? 'status-danger' : 'status-warning'}`}>
                          {alerte.priorite}
                        </span>
                        <span className="alerte-type">
                          {TYPE_MAINTENANCE_LABELS[alerte.typeIntervention] || alerte.typeIntervention}
                        </span>
                      </div>
                      
                      <div className="alerte-body">
                        <div className="alerte-camion">
                          {Icons.truck}
                          <span className="matricule">{alerte.camion}</span>
                        </div>
                        
                        <div className="alerte-details">
                          <div className="alerte-detail">
                            <span className="detail-label">Km actuel</span>
                            <span className="detail-value">{(alerte.kilometrageActuel || 0).toLocaleString()} km</span>
                          </div>
                          <div className="alerte-detail">
                            <span className="detail-label">Depuis intervention</span>
                            <span className="detail-value">{(alerte.kilometrageDepuisIntervention || 0).toLocaleString()} km</span>
                          </div>
                          <div className="alerte-detail">
                            <span className="detail-label">Intervalle</span>
                            <span className="detail-value">{(alerte.intervalleRecommande || 0).toLocaleString()} km</span>
                          </div>
                        </div>

                        <div className="alerte-progress">
                          <div className="progress-bar">
                            <div 
                              className={`progress-fill ${alerte.priorite === 'URGENT' ? 'progress-danger' : 'progress-warning'}`}
                              style={{ 
                                width: `${Math.min(((alerte.kilometrageDepuisIntervention || 0) / (alerte.intervalleRecommande || 1)) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                          <span className="progress-text">
                            {alerte.intervalleRecommande ? Math.round((alerte.kilometrageDepuisIntervention / alerte.intervalleRecommande) * 100) : 0}%
                          </span>
                        </div>
                      </div>

                      <div className="alerte-footer">
                        <button className="btn btn-sm btn-primary" onClick={() => openPlanifierModal(alerte)}>
                          {Icons.calendar} Planifier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ==================== MODALS ==================== */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {modalType === 'intervention' && (editingItem ? <>{Icons.edit} Modifier intervention</> : <>{Icons.plus} Nouvelle intervention</>)}
                  {modalType === 'regle' && (editingItem ? <>{Icons.edit} Modifier règle</> : <>{Icons.plus} Nouvelle règle</>)}
                  {modalType === 'planifier' && <>{Icons.calendar} Planifier maintenance</>}
                </h2>
                <button className="btn-icon" onClick={() => setShowModal(false)}>
                  {Icons.close}
                </button>
              </div>

              {/* Intervention Form */}
              {modalType === 'intervention' && (
                <form onSubmit={handleInterventionSubmit}>
                  <div className="modal-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Camion *</label>
                        <select
                          value={interventionForm.camion}
                          onChange={(e) => setInterventionForm({ ...interventionForm, camion: e.target.value })}
                          required
                        >
                          <option value="">Sélectionner</option>
                          {camions.map(c => (
                            <option key={c._id} value={c._id}>{c.matricule} - {c.marque} {c.model}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Type *</label>
                        <select
                          value={interventionForm.type}
                          onChange={(e) => setInterventionForm({ ...interventionForm, type: e.target.value })}
                          required
                        >
                          <option value="">Sélectionner</option>
                          {Object.entries(TYPE_MAINTENANCE).map(([key, value]) => (
                            <option key={key} value={value}>{TYPE_MAINTENANCE_LABELS[key]}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Date intervention *</label>
                        <input
                          type="date"
                          value={interventionForm.dateIntervention}
                          onChange={(e) => setInterventionForm({ ...interventionForm, dateIntervention: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Kilométrage *</label>
                        <input
                          type="number"
                          value={interventionForm.kilometrageVehicule}
                          onChange={(e) => setInterventionForm({ ...interventionForm, kilometrageVehicule: e.target.value })}
                          placeholder="Ex: 150000"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Coût (DH) *</label>
                        <input
                          type="number"
                          value={interventionForm.cout}
                          onChange={(e) => setInterventionForm({ ...interventionForm, cout: e.target.value })}
                          placeholder="Ex: 1500"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>N° Facture</label>
                        <input
                          type="text"
                          value={interventionForm.numeroFacture}
                          onChange={(e) => setInterventionForm({ ...interventionForm, numeroFacture: e.target.value })}
                          placeholder="Ex: FAC-2024-001"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={interventionForm.description}
                        onChange={(e) => setInterventionForm({ ...interventionForm, description: e.target.value })}
                        placeholder="Description de l'intervention..."
                        rows={3}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'En cours...' : (editingItem ? 'Mettre à jour' : 'Créer')}
                    </button>
                  </div>
                </form>
              )}

              {/* Regle Form */}
              {modalType === 'regle' && (
                <form onSubmit={handleRegleSubmit}>
                  <div className="modal-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Type véhicule *</label>
                        <select
                          value={regleForm.typeVehicule}
                          onChange={(e) => setRegleForm({ ...regleForm, typeVehicule: e.target.value })}
                          required
                        >
                          <option value="">Sélectionner</option>
                          {Object.entries(TYPE_VEHICULE).map(([key, value]) => (
                            <option key={key} value={value}>{TYPE_VEHICULE_LABELS[key]}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Type intervention *</label>
                        <select
                          value={regleForm.typeIntervention}
                          onChange={(e) => setRegleForm({ ...regleForm, typeIntervention: e.target.value })}
                          required
                        >
                          <option value="">Sélectionner</option>
                          {Object.entries(TYPE_MAINTENANCE).map(([key, value]) => (
                            <option key={key} value={value}>{TYPE_MAINTENANCE_LABELS[key]}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Intervalle kilométrique (km) *</label>
                      <input
                        type="number"
                        value={regleForm.intervalleKilometres}
                        onChange={(e) => setRegleForm({ ...regleForm, intervalleKilometres: e.target.value })}
                        placeholder="Ex: 10000"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={regleForm.description}
                        onChange={(e) => setRegleForm({ ...regleForm, description: e.target.value })}
                        placeholder="Description de la règle..."
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'En cours...' : (editingItem ? 'Mettre à jour' : 'Créer')}
                    </button>
                  </div>
                </form>
              )}

              {/* Planifier Form */}
              {modalType === 'planifier' && (
                <form onSubmit={handlePlanifierSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Camion *</label>
                      <select
                        value={planifierForm.camionId}
                        onChange={(e) => setPlanifierForm({ ...planifierForm, camionId: e.target.value })}
                        required
                      >
                        <option value="">Sélectionner</option>
                        {camions.map(c => (
                          <option key={c._id} value={c._id}>{c.matricule} - {c.marque} {c.model}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Type intervention *</label>
                      <select
                        value={planifierForm.typeIntervention}
                        onChange={(e) => setPlanifierForm({ ...planifierForm, typeIntervention: e.target.value })}
                        required
                      >
                        <option value="">Sélectionner</option>
                        {Object.entries(TYPE_MAINTENANCE).map(([key, value]) => (
                          <option key={key} value={value}>{TYPE_MAINTENANCE_LABELS[key]}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date prévue *</label>
                      <input
                        type="date"
                        value={planifierForm.datePrevu}
                        onChange={(e) => setPlanifierForm({ ...planifierForm, datePrevu: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'En cours...' : 'Planifier'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{Icons.alert} Confirmation</h2>
                <button className="btn-icon" onClick={() => setDeleteConfirm(null)}>
                  {Icons.close}
                </button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir supprimer {deleteConfirm.type === 'intervention' ? 'cette intervention' : 'cette règle'} ?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Annuler</button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => deleteConfirm.type === 'intervention' ? handleDeleteIntervention(deleteConfirm.id) : handleDeleteRegle(deleteConfirm.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceList;
