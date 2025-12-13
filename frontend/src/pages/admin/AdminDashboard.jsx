import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/dashboard';
import './AdminDashboard.css';

// Icônes SVG inline
const Icons = {
  truck: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3m15-5h2v5h-2M7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/><path d="M14 17V5h5l3 5v7"/></svg>,
  trailer: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="10" rx="2"/><circle cx="6" cy="16" r="2"/><circle cx="14" cy="16" r="2"/><path d="M19 11h4"/></svg>,
  route: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  chart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>,
  fuel: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M3 10h12"/><path d="M15 22V10l4-2v8l-4 2"/></svg>,
  team: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  mapPin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
};

const AdminDashboard = () => {
  const navigate = useNavigate();
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

  // Format date
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

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
  const derniersTrajets = stats.trajets?.derniers || [];

  return (
    <div className="dash">
      <header className="dash-header">
        <div className="dash-header-left">
          <h1>Tableau de bord</h1>
          <p>Gestion de flotte • Supervision en temps réel</p>
        </div>
        <div className="quick-actions">
          <button className="action-btn" onClick={() => navigate('/admin/trajets/nouveau')}>
            {Icons.plus} <span>Nouveau trajet</span>
          </button>
          <button className="action-btn action-secondary" onClick={() => navigate('/admin/camions/nouveau')}>
            {Icons.plus} <span>Ajouter camion</span>
          </button>
        </div>
      </header>

      {/* Métriques */}
      <div className="metrics">
        <div className="metric">
          <div className="metric-icon">{Icons.truck}</div>
          <div className="metric-content">
            <span className="metric-value">{camions.total}</span>
            <span className="metric-label">Camions</span>
            <span className="metric-sub">{camions.disponibles} disponibles</span>
          </div>
        </div>
        <div className="metric">
          <div className="metric-icon">{Icons.trailer}</div>
          <div className="metric-content">
            <span className="metric-value">{remorques.total}</span>
            <span className="metric-label">Remorques</span>
            <span className="metric-sub">{remorques.disponibles} disponibles</span>
          </div>
        </div>
        <div className="metric">
          <div className="metric-icon">{Icons.route}</div>
          <div className="metric-content">
            <span className="metric-value">{stats.trajets.enCours}</span>
            <span className="metric-label">En route</span>
            <span className="metric-sub">sur {stats.trajets.total} trajets</span>
          </div>
        </div>
        <div className="metric">
          <div className="metric-icon">{Icons.users}</div>
          <div className="metric-content">
            <span className="metric-value">{stats.chauffeurs.disponibles}</span>
            <span className="metric-label">Chauffeurs</span>
            <span className="metric-sub">sur {stats.chauffeurs.total} au total</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="sections">
        <div className="section">
          <h2>{Icons.chart} État de la flotte</h2>
          <div className="bars">
            <div className="bar-item">
              <div className="bar-header">
                <span>Camions disponibles</span>
                <span>{camions.disponibles}/{camions.total}</span>
              </div>
              <div className="bar">
                <div className="bar-fill bar-green" style={{ width: `${camions.total ? (camions.disponibles / camions.total) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="bar-item">
              <div className="bar-header">
                <span>Chauffeurs en mission</span>
                <span>{chauffeursMission}/{stats.chauffeurs.total}</span>
              </div>
              <div className="bar">
                <div className="bar-fill bar-blue" style={{ width: `${stats.chauffeurs.total ? (chauffeursMission / stats.chauffeurs.total) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="bar-item">
              <div className="bar-header">
                <span>Trajets terminés</span>
                <span>{trajetsTermines}/{stats.trajets.total}</span>
              </div>
              <div className="bar">
                <div className="bar-fill bar-gray" style={{ width: `${stats.trajets.total ? (trajetsTermines / stats.trajets.total) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>{Icons.fuel} Carburant</h2>
          <div className="data-grid">
            <div className="data-box">
              <span className="data-value">{stats.carburant.totalLitres}</span>
              <span className="data-unit">Litres</span>
            </div>
            <div className="data-box">
              <span className="data-value">{stats.carburant.totalMontant}</span>
              <span className="data-unit">MAD</span>
            </div>
            <div className="data-box">
              <span className="data-value">{stats.carburant?.nombrePleins || 0}</span>
              <span className="data-unit">Pleins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Derniers trajets + Équipe */}
      <div className="sections">
        <div className="section">
          <h2>{Icons.clock} Derniers trajets</h2>
          {derniersTrajets.length > 0 ? (
            <div className="trips-list">
              {derniersTrajets.map((t) => (
                <div className="trip-item" key={t._id}>
                  <div className="trip-route">
                    <span className="trip-location">{Icons.mapPin} {t.lieuDepart || 'Départ'}</span>
                    <span className="trip-arrow">{Icons.arrow}</span>
                    <span className="trip-location">{Icons.mapPin} {t.lieuArrivee || 'Arrivée'}</span>
                  </div>
                  <div className="trip-meta">
                    <span className="trip-date">{formatDate(t.dateDepart)}</span>
                    <span className={`status ${t.statut === 'TERMINE' ? 'status-ok' : t.statut === 'EN_COURS' ? 'status-busy' : 'status-pending'}`}>
                      {t.statut === 'TERMINE' ? 'Terminé' : t.statut === 'EN_COURS' ? 'En cours' : 'Planifié'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">Aucun trajet récent</div>
          )}
        </div>

        <div className="section">
          <h2>{Icons.team} Équipe</h2>
          {stats.chauffeurs.liste?.length > 0 ? (
            <div className="team-list">
              {stats.chauffeurs.liste.slice(0, 5).map((c) => (
                <div className="team-item" key={c._id}>
                  <div className="user-cell">
                    <div className="user-avatar">{c.prenom?.[0]}{c.nom?.[0]}</div>
                    <div className="user-info">
                      <span className="user-name">{c.prenom} {c.nom}</span>
                      <span className="user-email">{c.email}</span>
                    </div>
                  </div>
                  <span className={`status ${c.statut === 'DISPONIBLE' ? 'status-ok' : 'status-busy'}`}>
                    {c.statut === 'DISPONIBLE' ? 'Libre' : 'Mission'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">Aucun chauffeur</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;