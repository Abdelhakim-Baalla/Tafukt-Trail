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
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || 'Erreur lors du chargement du tableau de bord');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  if (!stats) return (
    <div className="dash">
      <div className="dash-empty">
        <p>{error || 'Impossible de charger les données'}</p>
        <button className="action-btn" onClick={fetchStats}>Réessayer</button>
      </div>
    </div>
  );

  const camions = stats.vehicules?.camions || { total: 0, disponibles: 0 };
  const remorques = stats.vehicules?.remorques || { total: 0, disponibles: 0 };
  const trajetsTotal = stats.trajets?.total || 0;
  const trajetsEnCours = stats.trajets?.enCours || 0;
  const trajetsTermines = stats.trajets?.termines || 0;
  const chauffeursTotal = stats.chauffeurs?.total || 0;
  const chauffeursDisponibles = stats.chauffeurs?.disponibles || 0;
  const chauffeursMission = chauffeursTotal - chauffeursDisponibles;
  const derniersTrajets = stats.trajets?.derniers || [];
  const pct = (part, total) => (total > 0 ? Math.round((part / total) * 100) : 0);
  const pctCamions = pct(camions.disponibles, camions.total);
  const pctRemorques = pct(remorques.disponibles, remorques.total);
  const pctTermines = pct(trajetsTermines, trajetsTotal);

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="dash">
      <section className="hero">
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-tags">
          <span className="hero-tag">{trajetsEnCours} en route</span>
          <span className="hero-tag">Réseau optimal</span>
        </div>
        <div className="hero-content">
          <p className="eyebrow eyebrow--light" style={{ marginBottom: 14 }}>Supervision flotte — {today}</p>
          <h1 className="hero-title">
            La flotte,
            <br />
            pilotée.
          </h1>
          <p className="hero-sub">
            Camions, trajets, carburant et maintenance suivis en temps réel,
            au même endroit.
          </p>
          <div className="hero-ctas">
            <button className="btn-split" onClick={() => navigate('/admin/trajets')}>
              <span className="btn-split-label">Nouveau trajet</span>
              <span className="btn-split-arrow">{Icons.arrow}</span>
            </button>
            <button className="btn-split dark" onClick={() => navigate('/admin/camions')}>
              <span className="btn-split-label">Ajouter camion</span>
              <span className="btn-split-arrow">{Icons.arrow}</span>
            </button>
          </div>
        </div>
        <div className="hero-stat-card">
          <div className="hero-stat-main">
            <span className="hero-stat-value">{camions.total}</span>
            <span className="hero-stat-label">Camions au parc</span>
            <span className="hero-stat-sub">{camions.disponibles} disponibles aujourd'hui</span>
          </div>
          <div className="hero-stat-side">
            <span className="hero-stat-label">Trajets suivis</span>
            <span className="hero-stat-value sm">{trajetsTotal}</span>
            <span className="hero-stat-sub">{trajetsTermines} terminés • {trajetsEnCours} en cours</span>
          </div>
        </div>
      </section>

      <div className="number-cards">
        <div className="number-card">
          <span className="number-value">{camions.total}</span>
          <span className="number-label">Camions au parc</span>
        </div>
        <div className="number-card">
          <span className="number-value">{trajetsTotal}</span>
          <span className="number-label">Trajets suivis</span>
        </div>
        <div className="number-card">
          <span className="number-value">{stats.carburant.totalLitres}</span>
          <span className="number-label">Litres consommés</span>
        </div>
        <div className="number-card">
          <span className="number-value">{chauffeursTotal}</span>
          <span className="number-label">Chauffeurs</span>
        </div>
      </div>

      {error && stats && (
        <div className="alert alert-error" style={{ margin: '0 0 1rem 0', padding: '0.75rem 1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', border: '1px solid #fecaca' }}>
          {error}
          <button onClick={fetchStats} style={{ marginLeft: '1rem', background: 'none', border: '1px solid #dc2626', borderRadius: '6px', color: '#dc2626', cursor: 'pointer', padding: '0.25rem 0.75rem' }}>Réessayer</button>
        </div>
      )}

      <div className="sections">
        <div className="section">
          <div className="section-head">
            <h2>{Icons.chart} État de la flotte</h2>
            <span className="count-pill">{pctCamions}% dispo</span>
          </div>
          <div className="bars">
            <div className="bar-item">
              <div className="bar-header">
                <span>Camions disponibles</span>
                <span>{camions.disponibles}/{camions.total}<span className="bar-pct">{pctCamions}%</span></span>
              </div>
              <div className="bar">
                <div className="bar-fill bar-green" style={{ width: `${camions.total ? (camions.disponibles / camions.total) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="bar-item">
              <div className="bar-header">
                <span>Chauffeurs en mission</span>
                <span>{chauffeursMission}/{chauffeursTotal}<span className="bar-pct">{pct(chauffeursMission, chauffeursTotal)}%</span></span>
              </div>
              <div className="bar">
                <div className="bar-fill bar-blue" style={{ width: `${chauffeursTotal ? (chauffeursMission / chauffeursTotal) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="bar-item">
              <div className="bar-header">
                <span>Trajets terminés</span>
                <span>{trajetsTermines}/{trajetsTotal}<span className="bar-pct">{pctTermines}%</span></span>
              </div>
              <div className="bar">
                <div className="bar-fill bar-gray" style={{ width: `${trajetsTotal ? (trajetsTermines / trajetsTotal) * 100 : 0}%` }} />
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

      <div className="sections">
        <div className="section">
          <div className="section-head">
            <h2>{Icons.clock} Derniers trajets</h2>
            <span className="count-pill">{derniersTrajets.length}</span>
          </div>
          {derniersTrajets.length > 0 ? (
            <div className="trips-list">
              {derniersTrajets.map((t) => (
                <div className="trip-item" key={t._id}>
                  <span className="tl-rail" aria-hidden="true">
                    <span className={`tl-dot ${t.statut === 'TERMINE' ? 'is-done' : t.statut === 'EN_COURS' ? 'is-busy' : ''}`} />
                    <span className="tl-line" />
                  </span>
                  <div className="trip-main">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">Aucun trajet récent</div>
          )}
        </div>

        <div className="section">
          <div className="section-head">
            <h2>{Icons.team} Équipe</h2>
            <span className="count-pill">{chauffeursDisponibles} libres</span>
          </div>
          {stats.chauffeurs?.liste?.length > 0 ? (
            <div className="team-list">
              {stats.chauffeurs.liste.slice(0, 5).map((c) => (
                <div className="team-item" key={c._id}>
                  <div className="user-cell">
                    <div className="avatar-wrap">
                      <div className="user-avatar">{c.prenom?.[0]}{c.nom?.[0]}</div>
                      <span className={`presence-dot ${c.statut === 'DISPONIBLE' ? 'is-free' : 'is-busy'}`} />
                    </div>
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