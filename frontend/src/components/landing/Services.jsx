import { useState } from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: '01',
    title: 'Gestion de flotte',
    body: 'Centralisez camions et remorques : statut, disponibilité, historique et documents au même endroit.',
    cta: 'Explorer la flotte',
    to: '/register',
    image: '/truck-background.jpg',
  },
  {
    id: '02',
    title: 'Suivi des trajets',
    body: 'Planifiez les itinéraires, assignez les chauffeurs et générez les ordres de mission en PDF.',
    cta: 'Voir les trajets',
    to: '/register',
    image: '/Homme-Debout-Devant-Un-Camion.jpg',
  },
  {
    id: '03',
    title: 'Carburant',
    body: 'Enregistrez chaque plein et analysez la consommation par véhicule ou par trajet.',
    cta: 'Suivre le carburant',
    to: '/register',
    image: '/trucker-old-man-truck.jpg',
  },
  {
    id: '04',
    title: 'Maintenance',
    body: 'Alertes préventives et règles de maintenance pour éviter les pannes coûteuses.',
    cta: 'Planifier la maintenance',
    to: '/register',
    image: '/truck-background.jpg',
  },
  {
    id: '05',
    title: 'Gestion des pneus',
    body: "Suivez l'usure, le kilométrage et optimisez les rotations de chaque pneu.",
    cta: 'Gérer les pneus',
    to: '/register',
    image: '/Homme-Debout-Devant-Un-Camion.jpg',
  },
  {
    id: '06',
    title: 'Rapports',
    body: 'Dashboards et exports PDF pour piloter performances et coûts au quotidien.',
    cta: 'Voir les rapports',
    to: '/register',
    image: '/trucker-old-man-truck.jpg',
  },
];

const Services = () => {
  const [open, setOpen] = useState('01');

  return (
    <section className="ld-services tt-section" id="services">
      <div className="tt-container">
        <div className="ld-services__head">
          <div>
            <span className="eyebrow eyebrow--accent">Nos services</span>
            <h2 className="ld-services__title">Tout ce qu&apos;il faut pour garder la flotte en mouvement</h2>
          </div>
          <p className="ld-services__lead">
            Des modules flexibles autour de vos véhicules, de vos trajets et de votre terrain.
          </p>
        </div>

        <div className="ld-services__grid">
          <aside className="ld-services__help">
            <img src="/truck-background.jpg" alt="" className="ld-services__help-img" />
            <h3>Besoin d&apos;aide pour choisir ?</h3>
            <p>
              Notre équipe vous oriente vers le bon parcours — admin flotte ou espace chauffeur —
              selon votre organisation.
            </p>
            <p className="ld-services__contact">
              <a href="tel:+212600000000">+212 6 00 00 00 00</a>
              <a href="mailto:contact@tafukt-trail.ma">contact@tafukt-trail.ma</a>
            </p>
            <div className="ld-services__person">
              <img src="/TafuktTrail-icon.png" alt="" />
              <div>
                <strong>— Sara Bennani</strong>
                <span>Responsable client</span>
              </div>
            </div>
          </aside>

          <div className="ld-services__acc" role="list">
            {services.map((s) => {
              const isOpen = open === s.id;
              return (
                <article
                  key={s.id}
                  className={`tt-acc-item ${isOpen ? 'is-open' : ''}`}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="tt-acc-trigger"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : s.id)}
                  >
                    <span className="tt-acc-num">{s.id}</span>
                    <span className="tt-acc-title">{s.title}</span>
                    <span className="tt-acc-icon" aria-hidden="true">{isOpen ? '—' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="tt-acc-panel ld-services__panel">
                      <p>{s.body}</p>
                      <Link to={s.to} className="btn btn--light btn--sm">
                        {s.cta} ↗
                      </Link>
                      <img src={s.image} alt="" className="ld-services__panel-img" />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
