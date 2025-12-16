import { useState, useEffect } from 'react';
import { getMesPleins, createPlein } from '../../../services/carburant';
import { getMesTrajets } from '../../../services/trajets';
import { useAuth } from '../../../context/AuthContext';
import './carburant.css';
import '../../chauffeur/chauffeur.css'; // Shared styles

const CarburantList = () => {
  const [pleins, setPleins] = useState([]);
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
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
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      const [pleinsData, trajetsData] = await Promise.all([
        getMesPleins(),
        getMesTrajets(userId)
      ]);
      setPleins(pleinsData);
      setTrajets(trajetsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableCamions = () => {
    // Extract unique camions from trajets
    const uniqueCamions = [];
    const map = new Map();
    if (trajets && trajets.length > 0) {
      for (const t of trajets) {
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
      // Calculate total if missing (optional but good UX)
      // data sent to backend
      await createPlein(formData);
      setShowModal(false);
      fetchData(); // Refresh list
      // Reset form (keep camion maybe?)
      setFormData({ ...formData, quantiteLitre: '', prixLitre: '', montantTotal: '', kilometrageCompteur: '', nomStation: '' });
    } catch (err) {
      alert('Erreur: ' + err.message);
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

  if (loading) return <div className="chauffeur-page">Chargement...</div>;

  const camions = getAvailableCamions();

  return (
    <main className="chauffeur-page">
      <header className="chauffeur-header">
        <div>
          <h1 className="chauffeur-title">Suivi Carburant</h1>
          <p className="chauffeur-subtitle">Historique et saisie des pleins</p>
        </div>
        <button className="btn-action btn-start" onClick={() => setShowModal(true)}>+ Nouveau Plein</button>
      </header>

      <div className="carburant-stats">
        <div className="carburant-stat-card">
          <div className="carburant-stat-value">{pleins.length}</div>
          <div className="carburant-stat-label">Pleins effectués</div>
        </div>
        <div className="carburant-stat-card">
          <div className="carburant-stat-value">
            {pleins.reduce((sum, p) => sum + p.quantiteLitre, 0).toFixed(0)} L
          </div>
          <div className="carburant-stat-label">Volume Total</div>
        </div>
        <div className="carburant-stat-card">
          <div className="carburant-stat-value">
            {pleins.reduce((sum, p) => sum + p.montantTotal, 0).toFixed(0)} MAD
          </div>
          <div className="carburant-stat-label">Coût Total</div>
        </div>
      </div>

      <section className="card">
        <div className="table-responsive">
          <table className="table-modern" aria-label="carburant">
            <thead>
              <tr>
                <th>Date</th>
                <th>Station</th>
                <th>Type</th>
                <th>Litres</th>
                <th>Prix/L</th>
                <th>Total</th>
                <th>Camion</th>
              </tr>
            </thead>
            <tbody>
              {pleins.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">Aucun plein enregistré</td>
                </tr>
              ) : (
                pleins.map(plein => (
                  <tr key={plein._id}>
                    <td>{new Date(plein.date).toLocaleDateString()} <br /> <small>{new Date(plein.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></td>
                    <td>{plein.nomStation}</td>
                    <td><span className="badge-info">{plein.typeCarburant}</span></td>
                    <td>{plein.quantiteLitre} L</td>
                    <td>{plein.prixLitre} MAD</td>
                    <td>{plein.montantTotal} MAD</td>
                    <td>{plein.camion?.matricule || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal Nouveau Plein */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Nouveau Plein</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Camion *</label>
                <select
                  required
                  value={formData.camion}
                  onChange={e => setFormData({ ...formData, camion: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: 'var(--tt-gray-900)', border: '1px solid var(--tt-gray-700)', color: 'white', borderRadius: '6px' }}
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
                  style={{ background: 'var(--tt-gray-700)', cursor: 'not-allowed' }}
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
                  style={{ width: '100%', padding: '10px', background: 'var(--tt-gray-900)', border: '1px solid var(--tt-gray-700)', color: 'white', borderRadius: '6px' }}
                >
                  <option value="DIESEL">Diesel</option>
                  <option value="ADBLUE">AdBlue</option>
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