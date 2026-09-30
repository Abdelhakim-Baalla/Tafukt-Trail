import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

const Hero = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const dash = isAdmin ? '/admin' : '/chauffeur';

  return (
    <section className="ld-hero" id="accueil">
      <video className="ld-hero__video" autoPlay loop muted playsInline poster="/truck-background.jpg">
        <source src="/1215.mp4" type="video/mp4" />
      </video>
      <div className="ld-hero__overlay" />

      <div className="tt-container ld-hero__inner">
        <div className="ld-hero__content">
          <span className="eyebrow eyebrow--light ld-hero__eyebrow">Gestion de flotte</span>
          <h1 className="ld-hero__title">
            Pilotez votre flotte.
            <span className="ld-hero__title-line">Avancez.</span>
          </h1>
          <p className="ld-hero__desc">
            Tafukt Trail centralise camions, trajets, maintenance et carburant —
            simple, fiable, pensé pour le transport routier.
          </p>
          <div className="ld-hero__cta">
            {isAuthenticated() ? (
              <Link to={dash} className="btn-split btn-split--light">
                <span className="btn-split-label">Accéder au Dashboard</span>
                <span className="btn-split-arrow"><ArrowIcon /></span>
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-split btn-split--light">
                  <span className="btn-split-label">Créer un compte</span>
                  <span className="btn-split-arrow"><ArrowIcon /></span>
                </Link>
                <a href="#services" className="btn btn--ghost">Nos services</a>
              </>
            )}
          </div>
        </div>

        <aside className="ld-hero__aside" aria-label="Indicateurs">
          <div className="ld-hero__chip">
            <span className="ld-hero__chip-dot" aria-hidden="true" />
            <span>98,5% missions à l&apos;heure</span>
          </div>
          <p className="ld-hero__chip-sub">Capacité de suivi — Q4 2026</p>

          <div className="ld-hero__lane">
            <div className="ld-hero__lane-text">
              <span className="ld-hero__lane-badge">NOUVEAU</span>
              <span className="ld-hero__lane-title">Casablanca → Agadir</span>
              <span className="ld-hero__lane-meta">Corridor prioritaire</span>
            </div>
            <img src="/Homme-Debout-Devant-Un-Camion.jpg" alt="" className="ld-hero__lane-img" />
          </div>
        </aside>
      </div>

      <div className="tt-container ld-hero__stats-wrap">
        <div className="ld-hero__stats">
          <div className="ld-hero__stats-light">
            <span className="ld-hero__stats-num">400+</span>
            <span className="ld-hero__stats-label">Véhicules suivis</span>
            <p className="ld-hero__stats-partners">Camions · Remorques · Pneus · Carburant</p>
          </div>
          <div className="ld-hero__stats-dark">
            <span className="ld-hero__stats-num">120</span>
            <span className="ld-hero__stats-label">Trajets actifs</span>
            <p className="ld-hero__stats-partners">Itinéraires, chauffeurs et ordres de mission</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
