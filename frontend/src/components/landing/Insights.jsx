const posts = [
  {
    cat: 'Flotte',
    date: '26 août 2026',
    title: 'Comment structurer le suivi de vos camions',
    image: '/truck-background.jpg',
  },
  {
    cat: 'Trajets',
    date: '12 sept. 2026',
    title: 'Ordres de mission : bonnes pratiques PDF',
    image: '/Homme-Debout-Devant-Un-Camion.jpg',
  },
  {
    cat: 'Coûts',
    date: '20 sept. 2026',
    title: 'Réduire la consommation carburant au kilomètre',
    image: '/trucker-old-man-truck.jpg',
  },
];

const Insights = () => (
  <section className="ld-insights tt-section" id="insights">
    <div className="tt-container">
      <span className="eyebrow">Insights flotte</span>
      <div className="ld-insights__head">
        <h2>Des repères pour piloter plus intelligemment</h2>
        <p>
          Guides pratiques, tendances terrain et conseils pour faire avancer votre
          activité au quotidien.
        </p>
      </div>
      <div className="ld-insights__grid">
        {posts.map((p) => (
          <article key={p.title} className="ld-insights__card">
            <img src={p.image} alt="" loading="lazy" />
            <p className="ld-insights__meta">
              {p.cat} · {p.date}
            </p>
            <h3>{p.title}</h3>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Insights;
