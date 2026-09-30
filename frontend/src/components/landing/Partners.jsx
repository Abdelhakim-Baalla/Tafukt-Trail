const partners = ['NORTHVALE', 'KILN & CO', 'Halcyon', 'Verdex', 'ATLAS PARTS'];

const Partners = () => (
  <section className="ld-partners">
    <div className="tt-container ld-partners__inner">
      <div className="ld-partners__copy">
        <span className="ld-partners__since">Depuis 2024</span>
        <h2 className="ld-partners__title">
          La flotte pilotée pour les transporteurs qui avancent.
        </h2>
      </div>
      <ul className="ld-partners__logos" aria-label="Références">
        {partners.map((name) => (
          <li key={name} className="ld-partners__logo">{name}</li>
        ))}
      </ul>
    </div>
  </section>
);

export default Partners;
