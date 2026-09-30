import { Link } from 'react-router-dom';

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

const stats = [
  {
    value: '15+ ans',
    text: "D'expertise terrain dans le transport routier, intégrée dans chaque écran.",
  },
  {
    value: '120+ routes',
    text: 'Itinéraires et corridors suivis avec assignation chauffeur et ordre de mission.',
  },
  {
    value: '98,5%',
    text: 'Taux de missions livrées dans les délais grâce au suivi centralisé.',
  },
  {
    value: '50K+',
    text: 'Pleins, rotations pneus et interventions de maintenance enregistrés.',
  },
];

const WhyChooseUs = () => (
  <section className="ld-why tt-section" id="apropos">
    <div className="tt-container ld-why__grid">
      <div className="ld-why__left">
        <span className="eyebrow eyebrow--accent">Pourquoi nous</span>
        <h2 className="ld-why__title">Une flotte qui travaille aussi dur que vous.</h2>
        <p className="ld-why__desc">
          Tafukt Trail regroupe véhicules, trajets et terrain dans une interface claire —
          pour décider plus vite et moins perdre de temps en admin.
        </p>

        <ul className="ld-why__stats">
          {stats.map((s) => (
            <li key={s.value} className="ld-why__stat">
              <span className="ld-why__stat-value">{s.value}</span>
              <span className="ld-why__stat-text">{s.text}</span>
            </li>
          ))}
        </ul>

        <Link to="/register" className="btn-split btn-split--dark">
          <span className="btn-split-label">En savoir plus</span>
          <span className="btn-split-arrow"><ArrowIcon /></span>
        </Link>
      </div>

      <div className="ld-why__right">
        <img
          src="/Homme-Debout-Devant-Un-Camion.jpg"
          alt="Professionnel devant un camion"
          className="ld-why__img ld-why__img--wide"
        />
        <div className="ld-why__media-row">
          <img
            src="/trucker-old-man-truck.jpg"
            alt="Chauffeur expérimenté"
            className="ld-why__img"
          />
          <blockquote className="ld-why__quote">
            <p>
              « Une bonne flotte, ce n&apos;est pas seulement des camions. C&apos;est de la
              certitude, de la visibilité, et une équipe qui avance ensemble. »
            </p>
            <footer>
              <img src="/TafuktTrail-icon.png" alt="" />
              <div>
                <cite>Karim El Amrani</cite>
                <span>Responsable exploitation</span>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
