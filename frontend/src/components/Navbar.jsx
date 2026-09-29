import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

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

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin, isChauffeur } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Masquer sur les pages auth
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

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

  const links = isAdmin ? adminLinks : isChauffeur ? chauffeurLinks : [];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" aria-label="Tafukt Trail accueil">
          <img src="/TafuktTrail-icon.png" alt="Tafukt" />
          <span className="nav-logo-text">Tafukt Trail</span>
        </Link>

        {links.length > 0 && (
          <div className="nav-links" role="navigation" aria-label="Navigation principale">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="nav-actions">
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
              <button onClick={handleLogout} className="nav-btn nav-btn-logout">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-primary">
                Connexion
              </Link>
              <Link to="/register" className="nav-btn nav-btn-secondary">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
