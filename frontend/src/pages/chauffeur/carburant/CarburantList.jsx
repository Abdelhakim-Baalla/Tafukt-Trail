import '../../chauffeur/chauffeur.css';

const CarburantList = () => {
  return (
    <main className="chauffeur-page">
      <header className="chauffeur-header">
        <div>
          <h1 className="chauffeur-title">Suivi Carburant</h1>
          <p className="chauffeur-subtitle">Historique et pleins</p>
        </div>
      </header>

      <section className="card">
        <table className="table-placeholder" aria-label="carburant">
          <thead>
            <tr>
              <th>Date</th>
              <th>Litres</th>
              <th>Coût</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-12-10</td>
              <td>150 L</td>
              <td>1500 MAD</td>
            </tr>
            <tr>
              <td>2025-11-28</td>
              <td>120 L</td>
              <td>1200 MAD</td>
            </tr>
          </tbody>
        </table>
        <div className="empty-note">Aucun filtre actif</div>
      </section>
    </main>
  );
};

export default CarburantList;