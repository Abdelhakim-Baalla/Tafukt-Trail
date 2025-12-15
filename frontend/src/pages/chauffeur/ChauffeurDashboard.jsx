import './chauffeur.css';

const ChauffeurDashboard = () => {
  return (
    <main className="chauffeur-page">
      <header className="chauffeur-header">
        <div>
          <h1 className="chauffeur-title">Dashboard Chauffeur</h1>
          <p className="chauffeur-subtitle">Mes trajets, pleins et missions quotidiennes</p>
        </div>
      </header>

      <section className="stats-row" aria-hidden>
        <div className="stat-card">
          <div className="stat-value">12</div>
          <div className="stat-label">Trajets aujourd'hui</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">4</div>
          <div className="stat-label">Pleins ce mois</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">98%</div>
          <div className="stat-label">Satisfaction</div>
        </div>
      </section>

      <section className="card">
        <h2 style={{margin:0, marginBottom:12}}>Trajets récents</h2>
        <table className="table-placeholder" aria-label="liste trajets">
          <thead>
            <tr>
              <th>Itinéraire</th>
              <th>Heure</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Casablanca → Rabat</td>
              <td>08:30</td>
              <td>En cours</td>
            </tr>
            <tr>
              <td>Rabat → Tanger</td>
              <td>12:00</td>
              <td>Planifié</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default ChauffeurDashboard;