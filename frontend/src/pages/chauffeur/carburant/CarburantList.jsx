import { useState, useEffect } from 'react';
import { getMesPleins, createPlein } from '../../../services/carburant';
import { getMesTrajets } from '../../../services/trajets';
import { useAuth } from '../../../context/AuthContext';
import { PlusIcon, BeakerIcon } from '@heroicons/react/24/outline';
import './carburant.css';
import '../../chauffeur/chauffeur.css'; // Shared styles

const CarburantList = () => {
  const [pleins, setPleins] = useState([]);
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    quantiteLitre: '',
    prixLitre: '',
    montantTotal: '',
    kilometrageCompteur: '',
    nomStation: '',
    typeCarburant: 'DIESEL',
    camion: ''
  });

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
      setError(null);
      const [pleinsData, trajetsData] = await Promise.all([
        getMesPleins(),
        getMesTrajets(userId)
      ]);
      setPleins(Array.isArray(pleinsData) ? pleinsData : []);
      setTrajets(Array.isArray(trajetsData) ? trajetsData : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur lors du chargement des pleins');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableCamions = () => {
    // Extract unique camions from ACTIVE trajets (EN_COURS or PLANIFIE)
    const uniqueCamions = [];
    const map = new Map();

    // Filter for active missions only
    const activeTrajets = trajets.filter(t => t.statut === 'EN_COURS' || t.statut === 'PLANIFIE');

    if (activeTrajets && activeTrajets.length > 0) {
      for (const t of activeTrajets) {
        if (t.camion && !map.has(t.camion._id)) {
          map.set(t.camion._id, true);
          uniqueCamions.push(t.camion);
        }
      }
    }
    return uniqueCamions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      // Calculate total if missing (optional but good UX)
      // data sent to backend
      await createPlein(formData);
      setShowModal(false);
      fetchData(); // Refresh list
      // Reset form (keep camion maybe?)
      setFormData({ ...formData, quantiteLitre: '', prixLitre: '', montantTotal: '', kilometrageCompteur: '', nomStation: '' });
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement du plein");
    }
  };

  // Auto-calculate total
  useEffect(() => {
    if (formData.quantiteLitre && formData.prixLitre) {
      setFormData(prev => ({
        ...prev,
        montantTotal: (parseFloat(prev.quantiteLitre) * parseFloat(prev.prixLitre)).toFixed(2)
      }));
    }
  }, [formData.quantiteLitre, formData.prixLitre]);

  if (loading) return <div className="chauffeur-page"><div className="chauffeur-loading">Chargement de vos pleins...</div></div>;

  const camions = getAvailableCamions();

  const totalLitres = pleins.reduce((sum, p) => sum + (Number(p.quantiteLitre) || 0), 0);
  const totalCout = pleins.reduce((sum, p) => sum + (Number(p.montantTotal) || 0), 0);

  const byKm = [...pleins]
    .filter(p => Number(p.kilometrageCompteur) > 0)
    .sort((a, b) => Number(a.kilometrageCompteur) - Number(b.kilometrageCompteur));

  const consoFor = (plein) => {
    const km = Number(plein.kilometrageCompteur);
    if (!Number.isFinite(km) || km <= 0) return null;
    const idx = byKm.findIndex(p => p._id === plein._id);
    if (idx <= 0) return null;
    const prevKm = Number(byKm[idx - 1].kilometrageCompteur);
    const litres = Number(plein.quantiteLitre);
    if (!Number.isFinite(prevKm) || !Number.isFinite(litres) || km <= prevKm || litres <= 0) return null;
    return (litres / (km - prevKm)) * 100;
  };

  const history = [...pleins].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <main className="chauffeur-page">
      <header className="chauffeur-header">
        <div>
          <h1 className="chauffeur-title">Suivi carburant</h1>
          <p className="chauffeur-subtitle">Historique et saisie des pleins</p>
        </div>
        <span className="shift-pill is-off" role="status">
          <span className="shift-dot" aria-hidden="true" />
          {pleins.length} plein{pleins.length > 1 ? 's' : ''}
        </span>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="alert-dismiss" onClick={() => setError(null)} aria-label="Fermer">×</button>
        </div>
      )}

      <section className="carburant-hero" aria-label="Ajout rapide">
        <div>
          <h2 className="carburant-hero-title">Un plein à déclarer</h2>
          <p className="carburant-hero-text">Saisie rapide pensée pour le bord de piste. Cela prend moins d une minute.</p>
        </div>
        <button className="carburant-hero-btn" onClick={() => setShowModal(true)}>
          <PlusIcon className="icon-w-5" aria-hidden="true" /> Nouveau plein
        </button>
      </section>

      <div className="carburant-stats" aria-label="Totaux carburant">
        <div className="carburant-stat-card">
          <div className="carburant-stat-value">
            {totalLitres.toFixed(0)} L
          </div>
          <div className="carburant-stat-label">Litres au compteur</div>
        </div>
        <div className="carburant-stat-card">
          <div className="carburant-stat-value">
            {totalCout.toFixed(0)} MAD
          </div>
          <div className="carburant-stat-label">Dépense totale</div>
        </div>
      </div>

      <section className="card" aria-label="Historique des pleins">
        <h2 className="card-title">Historique</h2>
        <p className="card-hint">Les plus récents en premier, avec consommation estimée.</p>
        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-well" aria-hidden="true"><BeakerIcon /></div>
            <p className="empty-title">Aucun plein enregistré</p>
            <p className="empty-text">Ajoutez votre premier plein avec le bouton ci dessus.</p>
          </div>
        ) : (
          <ul className="carburant-history">
            {history.map(plein => {
              const conso = consoFor(plein);
              return (
                <li key={plein._id} className="carburant-row">
                  <div className="carburant-row-main">
                    <div className="carburant-row-station">{plein.nomStation || 'Station inconnue'}</div>
                    <div className="carburant-row-sub">
                      {plein.date ? new Date(plein.date).toLocaleDateString('fr-FR') : ''} · {plein.quantiteLitre} L · {plein.camion?.matricule || 'Camion N/A'}
                    </div>
                  </div>
                  <div className="carburant-row-side">
                    <div className="carburant-row-amount">{plein.montantTotal} MAD</div>
                    <span className={`conso-chip ${conso === null ? '' : conso > 35 ? 'is-high' : 'is-good'}`}>
                      {conso === null ? 'Conso N/A' : `${conso.toFixed(1)} L/100km`}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Modal Nouveau Plein */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" role="dialog" aria-modal="true" aria-label="Nouveau plein">
            <h3>Nouveau Plein</h3>
            <p className="modal-sub">Remplissez les champs puis validez. Le total est calculé seul.</p>
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Camion *</label>
                <select
                  required
                  value={formData.camion}
                  onChange={e => setFormData({ ...formData, camion: e.target.value })}
                >
                  <option value="">Sélectionner un camion</option>
                  {camions.map(c => (
                    <option key={c._id} value={c._id}>{c.matricule} - {c.marque}</option>
                  ))}
                </select>
                {camions.length === 0 && <small style={{ color: 'orange' }}>Aucun camion assigné trouvé.</small>}
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="form-group-row" style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Litres *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.quantiteLitre}
                    onChange={e => setFormData({ ...formData, quantiteLitre: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Prix / Litre *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.prixLitre}
                    onChange={e => setFormData({ ...formData, prixLitre: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Montant Total (Calculé)</label>
                <input
                  type="number"
                  readOnly
                  value={formData.montantTotal}
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label>Kilométrage Compteur *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.kilometrageCompteur}
                  onChange={e => setFormData({ ...formData, kilometrageCompteur: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Station *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Total Kenitra"
                  value={formData.nomStation}
                  onChange={e => setFormData({ ...formData, nomStation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Type Carburant</label>
                <select
                  value={formData.typeCarburant}
                  onChange={e => setFormData({ ...formData, typeCarburant: e.target.value })}
                >
                  <option value="DIESEL">Diesel</option>
                  <option value="ESSENCE">Essence</option>
                  <option value="GAZ">Gaz</option>
                  <option value="ELECTRIQUE">Électrique</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Annuler</button>
                <button type="submit" className="btn-confirm">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default CarburantList;
