import { useState } from 'react';

const steps = [
  {
    id: '01',
    title: 'Créer votre compte',
    body: 'Inscrivez votre entreprise et configurez rôles admin et chauffeurs en quelques minutes.',
    metaLabel: 'Démarrage',
    meta: 'Compte prêt le jour même, sans carte bancaire.',
    image: '/Homme-Debout-Devant-Un-Camion.jpg',
  },
  {
    id: '02',
    title: 'Ajouter la flotte',
    body: 'Importez camions, remorques et pneus. Statuts et disponibilité visibles immédiatement.',
    metaLabel: 'Flotte',
    meta: 'Inventaire centralisé dès le premier véhicule.',
    image: '/truck-background.jpg',
  },
  {
    id: '03',
    title: 'Planifier les trajets',
    body: 'Créez les missions, assignez les chauffeurs et générez les ordres de mission PDF.',
    metaLabel: 'Ops',
    meta: 'Assignation claire, documents prêts pour la route.',
    image: '/trucker-old-man-truck.jpg',
  },
  {
    id: '04',
    title: 'Suivre le terrain',
    body: 'Carburant, maintenance et rapports — pilotez la flotte au quotidien.',
    metaLabel: 'Pilotage',
    meta: 'Alertes et exports pour décider plus vite.',
    image: '/Homme-Debout-Devant-Un-Camion.jpg',
  },
];

const HowItWorks = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="ld-how">
      <div className="ld-how__banner">
        <img src="/truck-background.jpg" alt="" />
      </div>
      <div className="tt-section">
        <div className="tt-container ld-how__grid">
          <div className="ld-how__intro">
            <span className="eyebrow eyebrow--accent">Comment ça marche</span>
            <h2>Une façon plus simple de piloter</h2>
            <p>
              Quatre étapes de l&apos;inscription au suivi terrain — choisissez-en une pour voir
              ce qui se passe de notre côté.
            </p>
          </div>

          <div className="ld-how__steps" role="tablist" aria-label="Étapes">
            {steps.map((s, i) => {
              const open = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={open}
                  className={`ld-how__step ${open ? 'is-open' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span className="ld-how__step-num">
                    <span className={open ? 'is-active' : ''}>{s.id}</span>
                    <span className="ld-how__step-total"> / 04</span>
                  </span>
                  {open && (
                    <div className="ld-how__step-body">
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                      <hr />
                      <span className="ld-how__meta-label">{s.metaLabel}</span>
                      <p className="ld-how__meta">{s.meta}</p>
                      <img src={s.image} alt="" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
