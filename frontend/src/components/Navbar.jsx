import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

const getInitials = (user) => {
  if (!user) return 'TT';
  const first = (user.prenom || '').trim().charAt(0);
  const last = (user.nom || '').trim().charAt(0);
  if (first || last) return `${first}${last}`.toUpperCase();
  if (user.email) return user.email.trim().charAt(0).toUpperCase();
  return 'TT';
};

const getDisplayName = (user) => {
  if (!user) return '';
  const full = `${user.prenom || ''} ${user.nom || ''}`.trim();
  return full || user.email || 'Utilisateur';
};

const landingLinks = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#apropos', label: 'À propos' },
  { href: '#services', label: 'Services' },
  { href: '#insights', label: 'Insights' },
  { href: '#contact', label: 'Contact' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin, isChauffeur } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/trajets', label: 'Trajets' },
    { path: '/admin/camions', label: 'Camions' },
    { path: '/admin/remorques', label: 'Remorques' },
    { path: '/admin/pneus', label: 'Pneus' },
    { path: '/admin/maintenance', label: 'Maintenance' },
    { path: '/admin/rapports', label: 'Rapports' },
  ];

  const chauffeurLinks = [
    { path: '/chauffeur', label: 'Dashboard' },
    { path: '/chauffeur/trajets', label: 'Trajets' },
    { path: '/chauffeur/carburant', label: 'Carburant' },
  ];

  const appLinks = isAdmin ? adminLinks : isChauffeur ? chauffeurLinks : [];

  const dateLabel = now.toLocaleString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className={`nav ${isLanding ? 'nav--landing' : 'nav--app'}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo" aria-label="Tafukt Trail accueil">
          <img src="/TafuktTrail-icon.png" alt="" />
          <span className="nav-logo-text">Tafukt Trail</span>
        </Link>

        {isLanding && !isAuthenticated() && (
          <nav className={`nav-pill ${menuOpen ? 'is-open' : ''}`} aria-label="Navigation principale">
            {landingLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-pill-link ${i === 0 ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {!isLanding && appLinks.length > 0 && (
          <nav className={`nav-pill nav-pill--app ${menuOpen ? 'is-open' : ''}`} aria-label="Navigation application">
            {appLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-pill-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="nav-actions">
          {isLanding && !isAuthenticated() && (
            <time className="nav-time" dateTime={now.toISOString()}>
              {dateLabel}
            </time>
          )}

          {isAuthenticated() ? (
            <>
              <div className="nav-user-chip">
                <span className="nav-avatar" aria-hidden="true">{getInitials(user)}</span>
                <span className="nav-user-meta">
                  <span className="nav-user-name">{getDisplayName(user)}</span>
                  {user?.role && (
                    <span className="nav-role-tag">{user.role === 'ADMIN' ? 'Admin' : 'Chauffeur'}</span>
                  )}
                </span>
              </div>
              <button type="button" onClick={handleLogout} className="nav-btn nav-btn--ghost">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              {isLanding ? (
                <Link to="/register" className="btn-split btn-split--light btn-split--sm">
                  <span className="btn-split-label">Créer un compte</span>
                  <span className="btn-split-arrow"><ArrowIcon /></span>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="nav-btn nav-btn--primary">Connexion</Link>
                  <Link to="/register" className="nav-btn nav-btn--ghost">S'inscrire</Link>
                </>
              )}
            </>
          )}

          <button
            type="button"
            className="nav-burger"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
