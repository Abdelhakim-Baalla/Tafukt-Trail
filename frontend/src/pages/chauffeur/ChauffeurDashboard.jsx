import { useState, useEffect } from 'react';
import { getMesTrajets, updateTrajetStatut, downloadOrdreMission } from '../../services/trajets';
import { getMesPleins } from '../../services/carburant'; // New import
import { useAuth } from '../../context/AuthContext';
import { DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import './chauffeur.css';

const ChauffeurDashboard = () => {
  const [trajets, setTrajets] = useState([]);
  const [pleins, setPleins] = useState([]); // New state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedTrajetId, setSelectedTrajetId] = useState(null);
  const [finishData, setFinishData] = useState({
    kilometrageArrivee: '',
    carburantNiveauxArrivee: '',
    dateHeureArrivee: '',
    commentairesChauffeur: ''
  });

  // Derived user ID from context (handles both _id and id)
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (userId) {
      fetchData();
    } else if (user === null) {
      setLoading(false);
    }
  }, [userId, user]);

  const fetchData = async () => {
    try {
      if (userId) {
        const [trajetsData, pleinsData] = await Promise.all([
            getMesTrajets(userId),
            getMesPleins()
        ]);
        setTrajets(trajetsData);
        setPleins(pleinsData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (newStatus === 'TERMINE') {
      setSelectedTrajetId(id);
      setFinishData({
        ...finishData,
        dateHeureArrivee: new Date().toISOString().slice(0, 16) // Default to now
      });
      setShowFinishModal(true);
      return;
    }

    try {
      await updateTrajetStatut(id, newStatus);
      fetchData(); // Refresh list
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const submitFinishTrajet = async (e) => {
    e.preventDefault();
    try {
      await updateTrajetStatut(selectedTrajetId, 'TERMINE', finishData);
      setShowFinishModal(false);
      fetchData();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      await downloadOrdreMission(id);
    } catch (err) {
      alert('Erreur lors du téléchargement du PDF');
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

  if (loading && !userId) return <div className="chauffeur-page">Chargement des données utilisateur...</div>;

  // Simple stats calculation
  const totalLitres = pleins.reduce((sum, p) => sum + p.quantiteLitre, 0);
  const totalCout = pleins.reduce((sum, p) => sum + p.montantTotal, 0);

  return (
    <main className="chauffeur-page">
      <header className="chauffeur-header">
        <div>
          <h1 className="chauffeur-title">Bonjour, {user?.nom || 'Chauffeur'}</h1>
          <p className="chauffeur-subtitle">Vos missions connectées</p>
        </div>
      </header>

      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{trajets.filter(t => t.statut === 'EN_COURS').length}</div>
          <div className="stat-label">Mission En Cours</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{trajets.filter(t => t.statut === 'PLANIFIE').length}</div>
          <div className="stat-label">Missions À Venir</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalLitres.toFixed(0)} L</div>
          <div className="stat-label">Carburant (Total)</div>
        </div>
        <div className="stat-card">
            <div className="stat-value">{totalCout.toFixed(0)} MAD</div>
            <div className="stat-label">Dépenses Carburant</div>
        </div>
      </section>

      <section className="card">
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Mes Trajets Récents</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="table-responsive">
          <table className="table-modern">
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
                  <td colSpan="5" className="text-center">Aucun trajet assigné</td>
                </tr>
              ) : (
                trajets.map(trajet => (
                  <tr key={trajet._id}>
                    <td>{new Date(trajet.dateHeureDepart).toLocaleDateString()} <br /> <small style={{color: 'var(--text-secondary)'}}>{new Date(trajet.dateHeureDepart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></td>
                    <td>
                      <div className="route-display">
                        <span className="city">{trajet.lieuDepart}</span>
                        <ArrowRightIcon className="icon-arrow" />
                        <span className="city">{trajet.lieuArrivee}</span>
                      </div>
                    </td>
                    <td>{trajet.camion?.matricule || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(trajet.statut)}`}>
                        {trajet.statut}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleDownloadPdf(trajet._id)}
                          className="btn-icon"
                          title="Télécharger Ordre de Mission"
                        >
                          <DocumentTextIcon className="icon-w-5" />
                        </button>
                        {trajet.statut === 'PLANIFIE' && (
                          <button
                            onClick={() => handleStatusUpdate(trajet._id, 'EN_COURS')}
                            className="btn-action btn-start"
                          >
                            Démarrer
                          </button>
                        )}
                        {trajet.statut === 'EN_COURS' && (
                          <button
                            onClick={() => handleStatusUpdate(trajet._id, 'TERMINE')}
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

export default ChauffeurDashboard;
