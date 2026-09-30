import { useState, useEffect } from 'react';
import { getMesTrajets, updateTrajetStatut, downloadOrdreMission } from '../../services/trajets';
import { getMesPleins } from '../../services/carburant'; // New import
import { useAuth } from '../../context/AuthContext';
import { DocumentTextIcon, ArrowRightIcon, TruckIcon, BeakerIcon, MapIcon } from '@heroicons/react/24/outline';
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'PLANIFIE': return 'Planifié';
      default: return status;
    }
  };

  if (loading) return <div className="chauffeur-page"><div className="chauffeur-loading">Chargement de vos missions...</div></div>;

  // Simple stats calculation
  const totalLitres = pleins.reduce((sum, p) => sum + (Number(p.quantiteLitre) || 0), 0);
  const totalCout = pleins.reduce((sum, p) => sum + (Number(p.montantTotal) || 0), 0);
  const totalKm = trajets.reduce((sum, t) => {
    const arrivee = Number(t.kilometrageArrivee ?? t.kmArrivee ?? t.kilometrage_arrivee);
    const depart = Number(t.kilometrageDepart ?? t.kmDepart ?? t.kilometrage_depart);
    const dist = Number(t.distanceKm ?? t.distance ?? 0);
    if (Number.isFinite(arrivee) && Number.isFinite(depart) && arrivee >= depart) return sum + (arrivee - depart);
    if (Number.isFinite(dist) && t.statut === 'TERMINE') return sum + dist;
    return sum;
  }, 0);

  const activeMission = trajets.find(t => t.statut === 'EN_COURS');
  const nextMission = activeMission || trajets.find(t => t.statut === 'PLANIFIE') || trajets[0] || null;
  const onShift = Boolean(activeMission);
  const recentPleins = [...pleins].slice(-4).reverse();

  const formatDateTime = (value) => {
    if (!value) return 'Date à confirmer';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return 'Date à confirmer';
    return `${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const camionLabel = (t) => {
    if (!t) return 'Camion à confirmer';
    if (typeof t.camion === 'string') return t.camion;
    return t.camion?.matricule ? `${t.camion.matricule}${t.camion.marque ? ` ${t.camion.marque}` : ''}` : 'Camion à confirmer';
  };

  const remorqueLabel = (t) => {
    if (!t) return null;
    if (typeof t.remorque === 'string') return t.remorque;
    return t.remorque?.matricule || t.remorque?.numero || null;
  };

  return (
    <main className="chauffeur-page">
      <header className="chauffeur-header">
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Espace chauffeur — missions</p>
          <h1 className="chauffeur-title">Bonjour, {user?.nom || 'Chauffeur'}</h1>
          <p className="chauffeur-subtitle">Vos missions connectées</p>
        </div>
        <span className={`shift-pill ${onShift ? 'is-on' : 'is-off'}`} role="status">
          <span className="shift-dot" aria-hidden="true" />
          {onShift ? 'En mission' : 'Disponible'}
        </span>
      </header>

      {error && <div className="error-message">{error}</div>}

      {nextMission ? (
        <section className="hero-card" aria-label="Prochaine mission">
          <div className="hero-photo" aria-hidden="true" />
          <div className="hero-eyebrow">
            <span>{nextMission.statut === 'EN_COURS' ? 'Mission en cours' : nextMission.statut === 'TERMINE' ? 'Dernière mission' : 'Prochaine mission'}</span>
            <span className={`status-badge ${getStatusBadgeClass(nextMission.statut)}`}>
              {getStatusLabel(nextMission.statut)}
            </span>
          </div>
          <p className="hero-route">
            <span className="city">{nextMission.lieuDepart}</span>
            <ArrowRightIcon className="icon-w-5" aria-hidden="true" />
            <span className="city">{nextMission.lieuArrivee}</span>
          </p>
          <p className="hero-dates">Départ le {formatDateTime(nextMission.dateHeureDepart)}</p>
          <div className="hero-chips">
            <span className="chip chip-amber"><TruckIcon className="icon-w-5" aria-hidden="true" /> {camionLabel(nextMission)}</span>
            {remorqueLabel(nextMission) && (
              <span className="chip">Remorque {remorqueLabel(nextMission)}</span>
            )}
          </div>
          <div className="hero-actions">
            <button
              onClick={() => handleStatusUpdate(nextMission._id, 'EN_COURS')}
              className="btn-action btn-start"
              disabled={nextMission.statut !== 'PLANIFIE'}
            >
              Démarrer
            </button>
            <button
              onClick={() => handleStatusUpdate(nextMission._id, 'TERMINE')}
              className="btn-action btn-finish"
              disabled={nextMission.statut !== 'EN_COURS'}
            >
              Terminer
            </button>
            <button
              onClick={() => handleDownloadPdf(nextMission._id)}
              className="btn-action btn-pdf"
            >
              <DocumentTextIcon className="icon-w-5" aria-hidden="true" /> PDF
            </button>
          </div>
          {nextMission.statut === 'TERMINE' && (
            <p className="hero-note">Mission terminée. Le PDF reste disponible pour vos archives.</p>
          )}
        </section>
      ) : (
        <section className="hero-card">
          <div className="hero-photo" aria-hidden="true" />
          <div className="empty-state">
            <div className="empty-icon-well" aria-hidden="true"><MapIcon /></div>
            <p className="empty-title">Aucune mission pour le moment</p>
            <p className="empty-text">Restez disponible. Vos prochains trajets apparaitront ici.</p>
          </div>
        </section>
      )}

      <section className="stats-row" aria-label="Statistiques">
        <div className="stat-card">
          <div className="stat-value stat-accent">{totalKm.toFixed(0)} km</div>
          <div className="stat-label">Km parcourus</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalLitres.toFixed(0)} L</div>
          <div className="stat-label">Litres</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{trajets.length}</div>
          <div className="stat-label">Trajets</div>
        </div>
      </section>

      <section className="card" aria-label="Mes pleins">
        <h2 className="card-title">Mes pleins</h2>
        <p className="card-hint">{recentPleins.length > 0 ? `Total carburant ${totalCout.toFixed(0)} MAD` : 'Vos derniers pleins apparaitront ici'}</p>
        {recentPleins.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-well" aria-hidden="true"><BeakerIcon /></div>
            <p className="empty-title">Aucun plein enregistré</p>
            <p className="empty-text">Ajoutez votre premier plein depuis la page carburant.</p>
          </div>
        ) : (
          <ul className="plein-mini-list">
            {recentPleins.map(p => (
              <li key={p._id} className="plein-mini-row">
                <div>
                  <div className="plein-mini-main">{p.nomStation || 'Station inconnue'}</div>
                  <div className="plein-mini-sub">
                    {p.date ? new Date(p.date).toLocaleDateString('fr-FR') : ''} · {Number(p.quantiteLitre) || 0} L
                  </div>
                </div>
                <div className="plein-mini-amount">{Number(p.montantTotal) ? `${Number(p.montantTotal).toFixed(0)} MAD` : ''}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal Fin de Trajet */}
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

export default ChauffeurDashboard;
