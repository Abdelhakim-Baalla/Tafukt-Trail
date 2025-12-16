import { useState, useEffect } from 'react';
import { getMesTrajets, downloadOrdreMission, updateTrajetStatut } from '../../../services/trajets';
import { useAuth } from '../../../context/AuthContext';
import { DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import '../../chauffeur/chauffeur.css';

const TrajetsList = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedTrajetId, setSelectedTrajetId] = useState(null);
  const [finishData, setFinishData] = useState({
    kilometrageArrivee: '',
    carburantNiveauxArrivee: '',
    dateHeureArrivee: '',
    commentairesChauffeur: ''
  });

  const fetchTrajets = async () => {
    try {
      if (userId) {
        const data = await getMesTrajets(userId);
        setTrajets(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchTrajets();
  }, [userId]);

  const handleDownloadPdf = async (id) => {
    try {
      await downloadOrdreMission(id);
    } catch (err) {
      alert('Erreur lors du téléchargement du PDF');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (newStatus === 'TERMINE') {
      setSelectedTrajetId(id);
      setFinishData({
        ...finishData,
        dateHeureArrivee: new Date().toISOString().slice(0, 16)
      });
      setShowFinishModal(true);
      return;
    }

    try {
      await updateTrajetStatut(id, newStatus);
      fetchTrajets();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const submitFinishTrajet = async (e) => {
    e.preventDefault();
    try {
      await updateTrajetStatut(selectedTrajetId, 'TERMINE', finishData);
      setShowFinishModal(false);
      fetchTrajets();
    } catch (err) {
      alert('Erreur: ' + err.message);
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

  if (loading) return <div>Chargement...</div>;

  return (
    <main className="chauffeur-page">
      <header className="chauffeur-header">
        <div>
          <h1 className="chauffeur-title">Liste des Trajets</h1>
          <p className="chauffeur-subtitle">Visualisez et gérez vos trajets</p>
        </div>
      </header>

      <section className="card">
        <div className="table-responsive">
          <table className="table-modern" aria-label="trajets">
            <thead>
              <tr>
                <th>Date</th>
                <th>Itinéraire</th>
                <th>Véhicule</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trajets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">Aucun trajet trouvé</td>
                </tr>
              ) : (
                trajets.map(t => (
                  <tr key={t._id}>
                    <td>{new Date(t.dateHeureDepart).toLocaleDateString()}</td>
                    <td>
                      <div className="route-display">
                        <span className="city">{t.lieuDepart}</span>
                        <ArrowRightIcon className="icon-arrow" />
                        <span className="city">{t.lieuArrivee}</span>
                      </div>
                    </td>
                    <td>{t.camion?.matricule || 'N/A'}</td>
                    <td><span className={`status-badge ${getStatusBadgeClass(t.statut)}`}>{t.statut}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => handleDownloadPdf(t._id)} title="Télécharger">
                          <DocumentTextIcon className="icon-w-5" />
                        </button>

                        {t.statut === 'PLANIFIE' && (
                          <button
                            onClick={() => handleStatusUpdate(t._id, 'EN_COURS')}
                            className="btn-action btn-start"
                          >
                            Démarrer
                          </button>
                        )}
                        {t.statut === 'EN_COURS' && (
                          <button
                            onClick={() => handleStatusUpdate(t._id, 'TERMINE')}
                            className="btn-action btn-finish"
                          >
                            Terminer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal Fin de Trajet */}
      {showFinishModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Terminer le trajet</h3>
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