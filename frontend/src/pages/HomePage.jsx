import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <main className="landing">
      <section className="hero">
        <video className="hero__video" autoPlay loop muted playsInline poster="/hero-poster.jpg">
          <source src="/1215.mp4" type="video/mp4" />
        </video>
        <div className="hero__overlay" />
        
        <div className="hero__container">
          <div className="hero__content">
            <h1 className="hero__title">
              Pilotez votre flotte.
              <span>Optimisez vos trajets.</span>
            </h1>
            
            <p className="hero__desc">
              Tafukt Trail centralise la gestion de vos camions, trajets, maintenance 
              et consommation carburant dans une interface simple et puissante.
            </p>

            <div className="hero__cta">
              {isAuthenticated() ? (
                <Link to={isAdmin ? '/admin' : '/chauffeur'} className="btn btn--primary btn--lg">
                  <span>Accéder au Dashboard</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn--primary btn--lg">
                    <span>Démarrer maintenant</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                  <Link to="/login" className="btn btn--outline btn--lg">
                    Connexion
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="hero__scroll">
          <span>Découvrir</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <header className="section-header">
            <span className="section-header__tag">Fonctionnalités</span>
            <h2 className="section-header__title">
              Tout ce qu'il faut pour gérer votre flotte
            </h2>
          </header>

          <div className="features__grid">
            <article className="feature-card">
              <div className="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="3" width="15" height="13" rx="2"/>
                  <path d="M16 8h4l3 3v5h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Gestion de Flotte</h3>
              <p className="feature-card__desc">
                Centralisez vos camions et remorques. Statut, disponibilité et historique en temps réel.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Suivi des Trajets</h3>
              <p className="feature-card__desc">
                Planifiez les itinéraires, assignez les chauffeurs et générez les ordres de mission.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5"/>
                  <path d="M18 9V4a2 2 0 0 0-2-2H8"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Consommation Carburant</h3>
              <p className="feature-card__desc">
                Enregistrez chaque plein et analysez la consommation par véhicule ou trajet.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Maintenance Préventive</h3>
              <p className="feature-card__desc">
                Alertes automatiques et règles de maintenance pour éviter les pannes coûteuses.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Gestion des Pneus</h3>
              <p className="feature-card__desc">
                Suivez l'usure, le kilométrage et optimisez les rotations de chaque pneu.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3v18h18"/>
                  <path d="M18 9l-5 5-4-4-3 3"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Rapports & Analytics</h3>
              <p className="feature-card__desc">
                Dashboards détaillés et exports PDF pour suivre les performances.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="split">
        <div className="split__media">
          <img src="/Homme-Debout-Devant-Un-Camion.jpg" alt="Professionnel du transport" loading="lazy" />
        </div>
        <div className="split__content">
          <span className="section-header__tag">Notre mission</span>
          <h2 className="split__title">
            Simplifier le quotidien des transporteurs
          </h2>
          <p className="split__text">
            Nous avons conçu Tafukt Trail avec des professionnels du transport pour 
            créer l'outil que nous aurions voulu avoir. Simple, efficace, et pensé 
            pour le terrain.
          </p>
          <ul className="split__list">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Interface intuitive et rapide
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Accessible sur tous les appareils
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Données sécurisées et sauvegardées
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Export PDF pour vos documents
            </li>
          </ul>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats__grid">
            <div className="stats__item">
              <span className="stats__value">500+</span>
              <span className="stats__label">Véhicules gérés</span>
            </div>
            <div className="stats__item">
              <span className="stats__value">50K</span>
              <span className="stats__label">Trajets suivis</span>
            </div>
            <div className="stats__item">
              <span className="stats__value">99%</span>
              <span className="stats__label">Disponibilité</span>
            </div>
            <div className="stats__item">
              <span className="stats__value">24/7</span>
              <span className="stats__label">Support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="split split--reverse">
        <div className="split__content">
          <span className="section-header__tag">Expérience</span>
          <h2 className="split__title">
            Des années d'expertise à votre service
          </h2>
          <p className="split__text">
            Notre équipe comprend les défis du transport routier. Chaque fonctionnalité 
            a été pensée pour répondre à vos besoins réels.
          </p>
          {!isAuthenticated() && (
            <Link to="/register" className="btn btn--dark btn--lg">
              <span>Rejoindre Tafukt Trail</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          )}
        </div>
        <div className="split__media">
          <img src="/trucker-old-man-truck.jpg" alt="Chauffeur expérimenté" loading="lazy" />
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta__card">
            <h2 className="cta__title">
              Prêt à optimiser votre flotte ?
            </h2>
            <p className="cta__text">
              Rejoignez les professionnels du transport qui font confiance à Tafukt Trail 
              pour gérer leur activité au quotidien.
            </p>
            <div className="cta__actions">
              {isAuthenticated() ? (
                <Link to={isAdmin ? '/admin' : '/chauffeur'} className="btn btn--primary btn--lg">
                  <span>Aller au Dashboard</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn--primary btn--lg">
                    <span>Créer un compte gratuit</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                  <Link to="/login" className="btn btn--ghost btn--lg">
                    Se connecter
                  </Link>
                </>
              )}
            </div>
            <div className="cta__features">
              <div className="cta__feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Essai gratuit</span>
              </div>
              <div className="cta__feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Aucune carte requise</span>
              </div>
              <div className="cta__feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
