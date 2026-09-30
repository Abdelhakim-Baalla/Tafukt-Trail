import { useState } from 'react';

const items = [
  {
    name: 'Michael Anderson',
    role: 'Responsable supply chain, Atlas Transport',
    quoteTitle: 'Ils nous ont donné la confiance pour avancer plus loin.',
    quote:
      'Avec Tafukt Trail, nos trajets et notre flotte sont enfin visibles au même endroit. Moins d’échanges dispersés, plus de décisions nettes.',
    rating: '5.0/5',
    image: '/trucker-old-man-truck.jpg',
  },
  {
    name: 'Fatima Zahra',
    role: 'Directrice d’exploitation, Nord Express',
    quoteTitle: 'La maintenance ne nous surprend plus.',
    quote:
      'Les alertes et le suivi carburant ont changé notre quotidien. On anticipe, on planifie, on réduit les immobilisations.',
    rating: '5.0/5',
    image: '/Homme-Debout-Devant-Un-Camion.jpg',
  },
  {
    name: 'Youssef Benali',
    role: 'Gérant, Benali Logistics',
    quoteTitle: 'Simple pour les chauffeurs, puissant pour le bureau.',
    quote:
      'L’espace chauffeur est clair. Au bureau, on suit tout : missions, pneus, rapports. Exactement ce qu’il nous manquait.',
    rating: '4.9/5',
    image: '/truck-background.jpg',
  },
];

const Testimonials = () => {
  const [active, setActive] = useState(0);
  const t = items[active];

  return (
    <section className="ld-testimonials tt-section">
      <div className="tt-container">
        <span className="eyebrow">Témoignages</span>
        <div className="ld-testimonials__grid">
          <div className="ld-testimonials__media">
            <img src={t.image} alt={t.name} className="ld-testimonials__photo" />
            <div className="ld-testimonials__thumbs" role="tablist" aria-label="Témoignages">
              {items.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={i === active ? 'is-active' : ''}
                  onClick={() => setActive(i)}
                >
                  <img src={item.image} alt="" />
                </button>
              ))}
            </div>
          </div>
          <div className="ld-testimonials__content">
            <span className="ld-testimonials__mark" aria-hidden="true">“</span>
            <h2>{t.quoteTitle}</h2>
            <p>{t.quote}</p>
            <div className="ld-testimonials__author">
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </div>
            <div className="ld-testimonials__rating">
              <span>{t.rating}</span>
              <span className="ld-testimonials__stars" aria-hidden="true">★★★★★</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
