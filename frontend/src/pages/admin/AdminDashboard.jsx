import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/dashboard';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur:', error);
        setStats({
          vehicules: { camions: { total: 0, disponibles: 0 }, remorques: { total: 0, disponibles: 0 } },
          trajets: { total: 0, enCours: 0, planifies: 0, termines: 0, derniers: [] },
          chauffeurs: { total: 0, disponibles: 0, liste: [] },
          carburant: { totalLitres: 0, totalMontant: 0, nombrePleins: 0 }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="loader"></div>
      </div>
    );
  }

  if (!stats) return <div className="dash-empty">Impossible de charger les données</div>;

  const camions = stats.vehicules?.camions || { total: 0, disponibles: 0 };
  const remorques = stats.vehicules?.remorques || { total: 0, disponibles: 0 };
  const trajetsTermines = stats.trajets?.termines || 0;
  const chauffeursMission = stats.chauffeurs.total - stats.chauffeurs.disponibles;

  return (
    <div className="dash">
      <div className="dash-header">
        <h1>Gestion de Flotte</h1>
        <p>Supervision en temps réel</p>
      </div>

      {/* Métriques principales */}
      <div className="metrics">
        <div className="metric">
          <div className="metric-value">{camions.total}</div>
          <div className="metric-label">Camions</div>
          <div className="metric-sub">{camions.disponibles} opérationnels</div>
        </div>
        <div className="metric">
          <div className="metric-value">{remorques.total}</div>
          <div className="metric-label">Remorques</div>
          <div className="metric-sub">{remorques.disponibles} disponibles</div>
        </div>
        <div className="metric">
          <div className="metric-value">{stats.trajets.enCours}</div>
          <div className="metric-label">En route</div>
          <div className="metric-sub">sur {stats.trajets.total} trajets</div>
        </div>
        <div className="metric">
          <div className="metric-value">{stats.chauffeurs.disponibles}</div>
          <div className="metric-label">Chauffeurs libres</div>
          <div className="metric-sub">sur {stats.chauffeurs.total} au total</div>
        </div>
      </div>

      {/* Sections */}
      <div className="sections">
        {/* Flotte */}
        <div className="section">
          <h2>État de la flotte</h2>
          <div className="bars">
            <div className="bar-item">
              <div className="bar-header">
                <span>Camions disponibles</span>
                <span>{camions.disponibles}/{camions.total}</span>
              </div>
              <div className="bar">
                <div 
                  className="bar-fill bar-green" 
                  style={{ width: `${camions.total ? (camions.disponibles / camions.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="bar-item">
              <div className="bar-header">
                <span>Chauffeurs en mission</span>
                <span>{chauffeursMission}/{stats.chauffeurs.total}</span>
              </div>
              <div className="bar">
                <div 
                  className="bar-fill bar-blue" 
                  style={{ width: `${stats.chauffeurs.total ? (chauffeursMission / stats.chauffeurs.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="bar-item">
              <div className="bar-header">
                <span>Trajets terminés</span>
                <span>{trajetsTermines}/{stats.trajets.total}</span>
              </div>
              <div className="bar">
                <div 
                  className="bar-fill bar-dark" 
                  style={{ width: `${stats.trajets.total ? (trajetsTermines / stats.trajets.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Carburant */}
        <div className="section">
          <h2>Consommation carburant</h2>
          <div className="data-grid">
            <div className="data-box">
              <span className="data-value">{stats.carburant.totalLitres}</span>
              <span className="data-unit">litres</span>
            </div>
            <div className="data-box">
              <span className="data-value">{stats.carburant.totalMontant}</span>
              <span className="data-unit">MAD</span>
            </div>
            <div className="data-box">
              <span className="data-value">{stats.carburant?.nombrePleins || 0}</span>
              <span className="data-unit">pleins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau chauffeurs */}
      <div className="section section-wide">
        <h2>Équipe</h2>
        {stats.chauffeurs.liste?.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Chauffeur</th>
                <th>Contact</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {stats.chauffeurs.liste.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{c.prenom?.[0]}{c.nom?.[0]}</div>
                      <span>{c.prenom} {c.nom}</span>
                    </div>
                  </td>
                  <td className="text-muted">{c.email}</td>
                  <td>
                    <span className={`status ${c.statut === 'DISPONIBLE' ? 'status-ok' : 'status-busy'}`}>
                      {c.statut === 'DISPONIBLE' ? 'Disponible' : 'En mission'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty">Aucun chauffeur enregistré</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;