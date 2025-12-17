import { useState, useEffect } from 'react';
import { getMesTrajets, downloadOrdreMission } from '../../../services/trajets';
import '../../chauffeur/chauffeur.css';

const TrajetsList = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        if (user.id) {
          const data = await getMesTrajets(user.id);
          setTrajets(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrajets();
  }, []);

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
                <th>Ordre de Mission</th>
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
                        <span className="arrow">→</span>
                        <span className="city">{t.lieuArrivee}</span>
                      </div>
                    </td>
                    <td>{t.camion?.matricule || 'N/A'}</td>
                    <td><span className={`status-badge ${getStatusBadgeClass(t.statut)}`}>{t.statut}</span></td>
                    <td>
                      <button className="btn-icon" onClick={() => handleDownloadPdf(t._id)} title="Télécharger">📄</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default TrajetsList;