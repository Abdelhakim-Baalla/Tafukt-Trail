import '../../chauffeur/chauffeur.css';

const TrajetsList = () => {
  return (
    <main className="chauffeur-page">
      <header className="chauffeur-header">
        <div>
          <h1 className="chauffeur-title">Liste des Trajets</h1>
          <p className="chauffeur-subtitle">Visualisez et gérez vos trajets</p>
        </div>
      </header>

      <section className="card">
        <table className="table-placeholder" aria-label="trajets">
          <thead>
            <tr>
              <th>Itinéraire</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Casa → Rabat</td>
              <td>2025-12-15</td>
              <td>En cours</td>
            </tr>
            <tr>
              <td>Rabat → Tanger</td>
              <td>2025-12-14</td>
              <td>Complété</td>
            </tr>
          </tbody>
        </table>
        <div className="empty-note">Utilisez les filtres pour affiner la liste.</div>
      </section>
    </main>
  );
};

export default TrajetsList;