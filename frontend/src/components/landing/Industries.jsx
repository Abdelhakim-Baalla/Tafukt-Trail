const cells = [
  {
    type: 'text',
    title: 'Transport routier',
    body: 'Gardez camions et remorques disponibles, assignés et suivis sur chaque mission.',
  },
  {
    type: 'image',
    span: 2,
    src: '/truck-background.jpg',
    alt: 'Flotte de transport',
  },
  {
    type: 'text',
    title: 'Exploitation',
    body: 'Trajets, chauffeurs et ordres de mission alignés pour livrer à l’heure.',
  },
  {
    type: 'image',
    src: '/Homme-Debout-Devant-Un-Camion.jpg',
    alt: 'Équipe exploitation',
  },
  {
    type: 'text',
    title: 'Maintenance',
    body: 'Alertes préventives et historique d’interventions pour limiter l’immobilisation.',
  },
  {
    type: 'image',
    src: '/trucker-old-man-truck.jpg',
    alt: 'Chauffeur',
  },
  {
    type: 'text',
    title: 'Carburant & coûts',
    body: 'Pleins enregistrés, consommation analysée, budget mieux maîtrisé.',
  },
  {
    type: 'text',
    title: 'Pneus',
    body: 'Usure, rotations et kilométrage suivis pour prolonger la durée de vie.',
  },
  {
    type: 'image',
    src: '/truck-background.jpg',
    alt: 'Entrepôt / flotte',
  },
  {
    type: 'text',
    title: 'Reporting',
    body: 'Tableaux de bord et PDF pour piloter l’activité et partager avec la direction.',
  },
  {
    type: 'image',
    src: '/Homme-Debout-Devant-Un-Camion.jpg',
    alt: 'Logistique',
  },
];

const Industries = () => (
  <section className="ld-industries tt-section">
    <div className="tt-container">
      <div className="ld-industries__head">
        <div>
          <span className="eyebrow eyebrow--accent">Cas d&apos;usage</span>
          <h2>Conçu pour chaque métier de la flotte</h2>
        </div>
        <p>
          De l&apos;exploitation à la maintenance, Tafukt Trail s&apos;adapte à la réalité
          du transport routier marocain.
        </p>
      </div>

      <div className="ld-industries__grid">
        {cells.map((cell, i) =>
          cell.type === 'image' ? (
            <div
              key={i}
              className={`ld-industries__cell ld-industries__cell--img ${cell.span === 2 ? 'span-2' : ''}`}
            >
              <img src={cell.src} alt={cell.alt} loading="lazy" />
            </div>
          ) : (
            <div key={i} className="ld-industries__cell ld-industries__cell--text">
              <h3>{cell.title}</h3>
              <p>{cell.body}</p>
            </div>
          )
        )}
      </div>
    </div>
  </section>
);

export default Industries;
