import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUserRole, isAuthenticated } from '../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getUserRole();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Masquer sur les pages auth
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const adminLinks = [
    { path: '/admin', label: 'Dashboard' },
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

  const links = userRole === 'ADMIN' ? adminLinks : userRole === 'CHAUFFEUR' ? chauffeurLinks : [];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <img src="/TafuktTrail-icon.png" className="w-10" alt="Tafukt" />
          <span className="nav-logo-text">Tafukt Trailer</span>
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
              <span className="nav-role">{userRole}</span>
              <button onClick={handleLogout} className="nav-btn">
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