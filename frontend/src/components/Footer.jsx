import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Tafukt Trail</span>
          <p className="footer-tagline">
            La flotte, pilotée. Camions, trajets et maintenance au même endroit.
          </p>
          <span className="footer-status">
            <span className="footer-dot" aria-hidden="true" />
            Système opérationnel
          </span>
        </div>
        <nav className="footer-col" aria-label="Produit">
          <span className="footer-col-title">Produit</span>
          <Link to="/">Accueil</Link>
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
        </nav>
        <nav className="footer-col" aria-label="Flotte">
          <span className="footer-col-title">Flotte</span>
          <Link to="/admin/trajets">Trajets</Link>
          <Link to="/admin/camions">Camions</Link>
          <Link to="/admin/maintenance">Maintenance</Link>
          <Link to="/admin/rapports">Rapports</Link>
        </nav>
        <div className="footer-col">
          <span className="footer-col-title">Contact</span>
          <span>contact@tafukt-trail.ma</span>
          <span>+212 6 00 00 00 00</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Tafukt Trail. Tous droits réservés.</span>
        <span>Conçu pour les transporteurs routiers</span>
      </div>
    </footer>
  );
};

export default Footer;
