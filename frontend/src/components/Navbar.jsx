import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin, isChauffeur } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
        <Link to="/" className="nav-logo">
          <img src="/TafuktTrail-icon.png" className="w-10" alt="Tafukt" />
          <span className="nav-logo-text">Tafukt Trail</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          {isAuthenticated() ? (
            <>
              <span className="nav-user-name">{user?.prenom || user?.nom || 'Utilisateur'}</span>
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
          
          <button 
            className="nav-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;