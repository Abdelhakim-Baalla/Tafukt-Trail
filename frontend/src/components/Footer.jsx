import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  const isApp =
    location.pathname.startsWith('/admin') || location.pathname.startsWith('/chauffeur');

  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  if (isApp) {
    return (
      <footer className="footer footer--app">
        <div className="footer-bottom footer-bottom--solo">
          <span>© 2026 Tafukt Trail. Tous droits réservés.</span>
          <span>La flotte, pilotée.</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src="/TafuktTrail-icon.png" alt="" />
            Tafukt Trail
          </Link>
          <p className="footer-tagline">
            Déplacez ce qui compte — camions, trajets et maintenance au même endroit.
          </p>
        </div>

        <nav className="footer-col" aria-label="Entreprise">
          <span className="footer-col-title">Entreprise</span>
          <a href="#accueil">Accueil</a>
          <a href="#apropos">À propos</a>
          <a href="#contact">Contact</a>
          <a href="#insights">Insights</a>
        </nav>

        <nav className="footer-col" aria-label="Services">
          <span className="footer-col-title">Services</span>
          <a href="#services">Gestion de flotte</a>
          <a href="#services">Trajets</a>
          <a href="#services">Carburant</a>
          <a href="#services">Tous les modules</a>
        </nav>

        <nav className="footer-col" aria-label="Compte">
          <span className="footer-col-title">Compte</span>
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
          <Link to="/admin">Espace admin</Link>
          <Link to="/chauffeur">Espace chauffeur</Link>
        </nav>

        <div className="footer-col">
          <span className="footer-col-title">Contact</span>
          <span>Casablanca, Maroc</span>
          <a href="tel:+212600000000">+212 6 00 00 00 00</a>
          <a href="mailto:contact@tafukt-trail.ma">contact@tafukt-trail.ma</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Tafukt Trail. Tous droits réservés.</span>
        <div className="footer-legal">
          <a href="#accueil">Confidentialité</a>
          <span>·</span>
          <a href="#accueil">Conditions</a>
          <span>·</span>
          <a href="#accueil">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
