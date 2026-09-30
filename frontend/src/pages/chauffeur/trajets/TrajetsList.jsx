import { useState, useEffect } from 'react';
import { getMesTrajets, updateTrajetStatut, downloadOrdreMission } from '../../../services/trajets';
import { useAuth } from '../../../context/AuthContext';
import { DocumentTextIcon, TruckIcon } from '@heroicons/react/24/outline';
import '../../chauffeur/chauffeur.css';

const TrajetsList = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedTrajetId, setSelectedTrajetId] = useState(null);
  const [finishData, setFinishData] = useState({
    kilometrageArrivee: '',
    carburantNiveauxArrivee: '',
    dateHeureArrivee: '',
    commentairesChauffeur: ''
  });

  const userId = user?.id || user?._id;

  useEffect(() => {
    if (authLoading) return;
    if (userId) {
      fetchTrajets();
    } else if (user === null) {
      setLoading(false);
    }
  }, [userId, user, authLoading]);

  const fetchTrajets = async () => {
    try {
      setError(null);
      const data = await getMesTrajets(userId);
      setTrajets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur lors du chargement des trajets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (newStatus === 'TERMINE') {
      setSelectedTrajetId(id);
      setFinishData({
        kilometrageArrivee: '',
        carburantNiveauxArrivee: '',
        dateHeureArrivee: new Date().toISOString().slice(0, 16),
        commentairesChauffeur: ''
      });
      setShowFinishModal(true);
      return;
    }
    try {
      await updateTrajetStatut(id, newStatus);
      fetchTrajets();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du statut');
    }
  };

  const submitFinishTrajet = async (e) => {
    e.preventDefault();
    try {
      await updateTrajetStatut(selectedTrajetId, 'TERMINE', finishData);
      setShowFinishModal(false);
      fetchTrajets();
    } catch (err) {
      setError(err.message || 'Erreur lors de la clôture du trajet');
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      await downloadOrdreMission(id);
    } catch (err) {
      setError(err.message || 'Erreur lors du téléchargement du PDF');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'EN_COURS': return 'badge-warning';
      case 'TERMINE': return 'badge-success';
      case 'PLANIFIE': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'PLANIFIE': return 'Planifié';
      default: return status;
    }
  };

  const getStepIndex = (status) => {
    if (status === 'EN_COURS') return 1;
    if (status === 'TERMINE') return 2;
    return 0;
  };

  const formatDateTime = (value) => {
    if (!value) return 'À confirmer';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return 'À confirmer';
    return `${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (loading) return <div className="chauffeur-page"><div className="chauffeur-loading">Chargement de vos trajets...</div></div>;

  return (
    <main className="chauffeur-page">
      <header className="chauffeur-header">
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Espace chauffeur — trajets</p>
          <h1 className="chauffeur-title">Mes trajets</h1>
          <p className="chauffeur-subtitle">Visualisez et gérez vos trajets</p>
        </div>
        <span className="shift-pill is-off" role="status">
          <span className="shift-dot" aria-hidden="true" />
          {trajets.length} mission{trajets.length > 1 ? 's' : ''}
        </span>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="alert-dismiss" onClick={() => setError(null)} aria-label="Fermer">×</button>
        </div>
      )}

      <section className="card" aria-label="trajets">
        {trajets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-well" aria-hidden="true"><TruckIcon /></div>
            <p className="empty-title">Aucun trajet trouvé</p>
            <p className="empty-text">Vos missions assignées apparaitront ici dès leur création.</p>
          </div>
        ) : (
          <div className="mission-list">
            {trajets.map(t => {
              const step = getStepIndex(t.statut);
              return (
                <article key={t._id} className="mission-card">
                  <div className="mission-top">
                    <div>
                      <p className="mission-route">{t.lieuDepart} → {t.lieuArrivee}</p>
                      <p className="mission-meta">Départ le {formatDateTime(t.dateHeureDepart)}</p>
                    </div>
                    <span className={`status-badge ${getStatusBadgeClass(t.statut)}`}>{getStatusLabel(t.statut)}</span>
                  </div>

                  <div className="timeline" aria-hidden="true">
                    <div className="timeline-rail">
                      <span className="timeline-dot is-solid" />
                      <span className="timeline-line" />
                      <span className="timeline-dot" />
                    </div>
                    <div className="timeline-body">
                      <div>
                        <div className="timeline-city">{t.lieuDepart}</div>
                        <div className="timeline-sub">{formatDateTime(t.dateHeureDepart)}</div>
                      </div>
                      <div>
                        <div className="timeline-city">{t.lieuArrivee}</div>
                        <div className="timeline-sub">{t.dateHeureArrivee ? formatDateTime(t.dateHeureArrivee) : 'Arrivée à confirmer'}</div>
                      </div>
                    </div>
                  </div>

                  <ol className="steps" aria-label="Avancement">
                    {['Planifié', 'En cours', 'Terminé'].map((label, i) => (
                      <li key={label} className={`step ${i < step ? 'is-done' : ''} ${i === step ? 'is-current' : ''}`}>
                        {label}
                      </li>
                    ))}
                  </ol>

                  <div className="mission-foot">
                    <span className="mission-vehicle">{t.camion?.matricule ? `Camion ${t.camion.matricule}` : 'Camion à confirmer'}</span>
                    <span style={{ flex: 1 }} />
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleDownloadPdf(t._id)} title="Télécharger l ordre de mission" aria-label="Télécharger le PDF">
                        <DocumentTextIcon className="icon-w-5" />
                      </button>
                      {t.statut === 'PLANIFIE' && (
                        <button className="btn-action btn-start" onClick={() => handleStatusUpdate(t._id, 'EN_COURS')}>
                          Démarrer
                        </button>
                      )}
                      {t.statut === 'EN_COURS' && (
                        <button className="btn-action btn-finish" onClick={() => handleStatusUpdate(t._id, 'TERMINE')}>
                          Terminer
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {showFinishModal && (
        <div className="modal-overlay">
          <div className="modal-content" role="dialog" aria-modal="true" aria-label="Terminer le trajet">
            <h3>Terminer le trajet</h3>
            <p className="modal-sub">Renseignez les informations d arrivée pour clôturer la mission.</p>
            <form onSubmit={submitFinishTrajet}>
              <div className="form-group">
                <label>Date Arrivée</label>
                <input
                  type="datetime-local"
                  required
                  value={finishData.dateHeureArrivee}
                  onChange={e => setFinishData({ ...finishData, dateHeureArrivee: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Kilométrage Arrivée</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={finishData.kilometrageArrivee}
                  onChange={e => setFinishData({ ...finishData, kilometrageArrivee: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Niveau Carburant Arrivée (%)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={finishData.carburantNiveauxArrivee}
                  onChange={e => setFinishData({ ...finishData, carburantNiveauxArrivee: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Commentaire</label>
                <textarea
                  value={finishData.commentairesChauffeur}
                  onChange={e => setFinishData({ ...finishData, commentairesChauffeur: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowFinishModal(false)} className="btn-cancel">Annuler</button>
                <button type="submit" className="btn-confirm">Confirmer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default TrajetsList;
