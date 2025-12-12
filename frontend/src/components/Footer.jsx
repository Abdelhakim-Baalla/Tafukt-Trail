import { useLocation } from 'react-router-dom';
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
          <span className="footer-logo">Tafukt</span>
        </div>
        <div className="footer-copyright">
          © 2025 Tafukt. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;