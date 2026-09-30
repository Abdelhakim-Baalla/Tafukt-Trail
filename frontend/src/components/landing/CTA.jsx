import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

const CTA = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const dash = isAdmin ? '/admin' : '/chauffeur';

  return (
    <section className="ld-cta">
      <img src="/truck-background.jpg" alt="" className="ld-cta__bg" />
      <div className="ld-cta__overlay" />
      <div className="tt-container ld-cta__inner">
        <span className="eyebrow eyebrow--light">CTA</span>
        <h2>Prêt à faire avancer votre flotte ?</h2>
        <p>
          Que vous gériez cinq camions ou une flotte nationale, notre équipe vous aide
          à déployer Tafukt Trail autour de votre métier.
        </p>
        <div className="ld-cta__actions">
          {isAuthenticated() ? (
            <Link to={dash} className="btn-split btn-split--light">
              <span className="btn-split-label">Aller au Dashboard</span>
              <span className="btn-split-arrow"><ArrowIcon /></span>
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-split btn-split--light">
                <span className="btn-split-label">Créer un compte</span>
                <span className="btn-split-arrow"><ArrowIcon /></span>
              </Link>
              <a href="tel:+212600000000" className="btn btn--ghost">
                Appeler le support
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTA;
