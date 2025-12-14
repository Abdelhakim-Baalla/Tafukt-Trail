import { useState, useEffect } from 'react';
import { getAllTrajets, getAllCamions, getAllRemorques, getAllPleinsCarburant, getTrajetPdf } from '../../../services/vehicules';
import '../vehicules.css';
import './rapports.css';

// SVG Icons
const Icons = {
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  pdf: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12h4M10 16h4M8 12h.01M8 16h.01"/></svg>,
  truck: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3m15-5h2v5h-2M7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/><path d="M14 17V5h5l3 5v7"/></svg>,
  route: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>,
  fuel: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M3 10h12"/><path d="M15 22V10l4-2v8l-4 2"/></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>,
  trendUp: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  printer: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  refresh: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  fileText: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

const PERIODES = {
  SEMAINE: 'semaine',
  MOIS: 'mois',
  TRIMESTRE: 'trimestre',
  ANNEE: 'annee',
  TOUT: 'tout'
};

const RapportsList = () => {
  const [loading, setLoading] = useState(true);
  const [trajets, setTrajets] = useState([]);
  const [camions, setCamions] = useState([]);
  const [remorques, setRemorques] = useState([]);
  const [pleins, setPleins] = useState([]);
  const [periode, setPeriode] = useState(PERIODES.MOIS);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [periode]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [trajetsRes, camionsRes, remorquesRes, pleinsRes] = await Promise.all([
        getAllTrajets(),
        getAllCamions(),
        getAllRemorques(),
        getAllPleinsCarburant().catch(() => [])
      ]);

      setTrajets(Array.isArray(trajetsRes) ? trajetsRes : []);
      setCamions(Array.isArray(camionsRes) ? camionsRes : []);
      setRemorques(Array.isArray(remorquesRes) ? remorquesRes : []);
      setPleins(Array.isArray(pleinsRes) ? pleinsRes : []);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer par période
  const filterByPeriode = (items, dateField = 'createdAt') => {
    if (periode === PERIODES.TOUT) return items;
    
    const now = new Date();
    let startDate = new Date();
    
    switch (periode) {
      case PERIODES.SEMAINE:
        startDate.setDate(now.getDate() - 7);
        break;
      case PERIODES.MOIS:
        startDate.setMonth(now.getMonth() - 1);
        break;
      case PERIODES.TRIMESTRE:
        startDate.setMonth(now.getMonth() - 3);
        break;
      case PERIODES.ANNEE:
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return items;
    }
    
    return items.filter(item => {
      const itemDate = new Date(item[dateField] || item.dateHeureDepart);
      return itemDate >= startDate;
    });
  };

  // Calculer les statistiques filtrées
  const filteredTrajets = filterByPeriode(trajets, 'dateHeureDepart');
  const filteredPleins = filterByPeriode(pleins, 'date');

  const statsCalculees = {
    trajets: {
      total: filteredTrajets.length,
      termines: filteredTrajets.filter(t => t.statut === 'TERMINE').length,
      enCours: filteredTrajets.filter(t => t.statut === 'EN_COURS').length,
      planifies: filteredTrajets.filter(t => t.statut === 'PLANIFIE').length,
      annules: filteredTrajets.filter(t => t.statut === 'ANNULE').length,
    },
    km: {
      total: filteredTrajets.reduce((sum, t) => {
        const kmDepart = t.kilometrageDepart || 0;
        const kmArrivee = t.kilometrageArrivee || 0;
        return sum + (kmArrivee > kmDepart ? kmArrivee - kmDepart : 0);
      }, 0)
    },
    carburant: {
      litres: filteredPleins.reduce((sum, p) => sum + (p.quantiteLitre || 0), 0),
      montant: filteredPleins.reduce((sum, p) => sum + (p.montantTotal || 0), 0),
      pleins: filteredPleins.length
    }
  };

  // ==================== EXPORT CSV NATIF (SANS BIBLIOTHÈQUE) ====================
  
  /**
   * Échappe les valeurs CSV pour gérer les caractères spéciaux
   * - Guillemets doubles sont doublés
   * - Valeurs contenant virgule, guillemet ou saut de ligne sont entourées de guillemets
   */
  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // Si contient des caractères spéciaux, on entoure de guillemets
    if (stringValue.includes('"') || stringValue.includes(';') || stringValue.includes('\n') || stringValue.includes(',')) {
      // Double les guillemets existants et entoure de guillemets
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };

  /**
   * Génère et télécharge un fichier CSV à partir des données
   * @param {Array} data - Tableau d'objets à exporter
   * @param {string} filename - Nom du fichier (sans extension)
   * @param {Array} columns - Configuration des colonnes [{key, label}]
   */
  const exportToCSV = (data, filename, columns) => {
    if (!data || data.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    // Créer l'en-tête avec BOM pour Excel (support UTF-8)
    const BOM = '\uFEFF';
    
    // En-têtes
    const headers = columns.map(col => escapeCSVValue(col.label)).join(';');
    
    // Lignes de données
    const rows = data.map(item => {
      return columns.map(col => {
        let value = item[col.key];
        
        // Gestion des objets imbriqués
        if (typeof value === 'object' && value !== null) {
          if (col.key === 'camion') value = value.matricule || '';
          else if (col.key === 'chauffeur') value = `${value.prenom || ''} ${value.nom || ''}`.trim();
          else if (col.key === 'remorque') value = value.matricule || '';
          else value = JSON.stringify(value);
        }
        
        // Formatage des dates
        if (col.type === 'date' && value) {
          value = new Date(value).toLocaleDateString('fr-FR');
        }
        if (col.type === 'datetime' && value) {
          value = new Date(value).toLocaleString('fr-FR');
        }
        
        // Formatage des nombres
        if (col.type === 'number' && value !== undefined) {
          value = Number(value).toLocaleString('fr-FR');
        }
        
        return escapeCSVValue(value);
      }).join(';');
    });

    // Assembler le CSV
    const csvContent = BOM + [headers, ...rows].join('\n');
    
    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Trajets en CSV
  const exportTrajetsCSV = () => {
    const columns = [
      { key: 'dateHeureDepart', label: 'Date Départ', type: 'datetime' },
      { key: 'lieuDepart', label: 'Lieu Départ' },
      { key: 'lieuArrivee', label: 'Lieu Arrivée' },
      { key: 'camion', label: 'Camion' },
      { key: 'chauffeur', label: 'Chauffeur' },
      { key: 'remorque', label: 'Remorque' },
      { key: 'kilometrageDepart', label: 'Km Départ', type: 'number' },
      { key: 'kilometrageArrivee', label: 'Km Arrivée', type: 'number' },
      { key: 'carburantNiveauxDepart', label: 'Carburant Départ (L)', type: 'number' },
      { key: 'carburantNiveauxArrivee', label: 'Carburant Arrivée (L)', type: 'number' },
      { key: 'statut', label: 'Statut' },
    ];
    
    // Ajouter colonne distance calculée
    const dataWithDistance = filteredTrajets.map(t => ({
      ...t,
      distance: (t.kilometrageArrivee || 0) - (t.kilometrageDepart || 0)
    }));
    columns.push({ key: 'distance', label: 'Distance (km)', type: 'number' });
    
    exportToCSV(dataWithDistance, 'rapport_trajets', columns);
  };

  // Export Flotte en CSV
  const exportFlotteCSV = () => {
    const columns = [
      { key: 'matricule', label: 'Matricule' },
      { key: 'marque', label: 'Marque' },
      { key: 'modele', label: 'Modèle' },
      { key: 'anneeFabrication', label: 'Année' },
      { key: 'kilometrageActuel', label: 'Kilométrage', type: 'number' },
      { key: 'typeCarburant', label: 'Type Carburant' },
      { key: 'reservoire', label: 'Réservoir (L)', type: 'number' },
      { key: 'statut', label: 'Statut' },
      { key: 'dateDernierControle', label: 'Dernier Contrôle', type: 'date' },
    ];
    
    // Normaliser le champ modele
    const data = camions.map(c => ({
      ...c,
      modele: c.modele || c.model
    }));
    
    exportToCSV(data, 'rapport_flotte_camions', columns);
  };

  // Export Remorques en CSV
  const exportRemorquesCSV = () => {
    const columns = [
      { key: 'matricule', label: 'Matricule' },
      { key: 'type', label: 'Type' },
      { key: 'capaciteTonnes', label: 'Capacité (T)', type: 'number' },
      { key: 'statut', label: 'Statut' },
    ];
    exportToCSV(remorques, 'rapport_remorques', columns);
  };

  // Export Carburant en CSV  
  const exportCarburantCSV = () => {
    const columns = [
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'camion', label: 'Camion' },
      { key: 'quantiteLitre', label: 'Quantité (L)', type: 'number' },
      { key: 'prixUnitaire', label: 'Prix/L', type: 'number' },
      { key: 'montantTotal', label: 'Montant Total', type: 'number' },
      { key: 'station', label: 'Station' },
    ];
    exportToCSV(filteredPleins, 'rapport_carburant', columns);
  };

  // ==================== EXPORT PDF (VIA BACKEND) ====================
  
  /**
   * Télécharge le PDF d'ordre de mission pour un trajet
   * @param {string} trajetId - ID du trajet
   */
  const downloadTrajetPDF = async (trajetId) => {
    try {
      const blob = await getTrajetPdf(trajetId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ordre_mission_${trajetId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur téléchargement PDF:', err);
      alert('Erreur lors du téléchargement du PDF');
    }
  };

  const handlePrint = () => window.print();

  const getPeriodeLabel = () => {
    switch (periode) {
      case PERIODES.SEMAINE: return '7 derniers jours';
      case PERIODES.MOIS: return '30 derniers jours';
      case PERIODES.TRIMESTRE: return '3 derniers mois';
      case PERIODES.ANNEE: return '12 derniers mois';
      case PERIODES.TOUT: return 'Toutes les données';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Chargement des rapports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container rapports-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">{Icons.chart}</div>
          <div>
            <h1>Rapports & Statistiques</h1>
            <p>Analyse des données • {getPeriodeLabel()}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={fetchData}>
            {Icons.refresh} Actualiser
          </button>
          <button className="btn btn-secondary" onClick={handlePrint}>
            {Icons.printer} Imprimer
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Filtres période */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>{Icons.calendar} Période :</label>
          <div className="btn-group">
            {Object.entries(PERIODES).map(([key, value]) => (
              <button
                key={key}
                className={`btn btn-sm ${periode === value ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setPeriode(value)}
              >
                {key === 'SEMAINE' && '7 jours'}
                {key === 'MOIS' && '30 jours'}
                {key === 'TRIMESTRE' && '3 mois'}
                {key === 'ANNEE' && '1 an'}
                {key === 'TOUT' && 'Tout'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cartes statistiques principales */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">{Icons.route}</div>
          <div className="stat-content">
            <span className="stat-value">{statsCalculees.trajets.total}</span>
            <span className="stat-label">Trajets</span>
          </div>
          <div className="stat-details">
            <span className="stat-detail">{statsCalculees.trajets.termines} terminés</span>
            <span className="stat-detail">{statsCalculees.trajets.enCours} en cours</span>
          </div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-icon">{Icons.trendUp}</div>
          <div className="stat-content">
            <span className="stat-value">{statsCalculees.km.total.toLocaleString()}</span>
            <span className="stat-label">Kilomètres</span>
          </div>
          <div className="stat-details">
            <span className="stat-detail">Distance totale</span>
          </div>
        </div>

        <div className="stat-card stat-orange">
          <div className="stat-icon">{Icons.fuel}</div>
          <div className="stat-content">
            <span className="stat-value">{statsCalculees.carburant.litres.toLocaleString()} L</span>
            <span className="stat-label">Carburant</span>
          </div>
          <div className="stat-details">
            <span className="stat-detail">{statsCalculees.carburant.montant.toLocaleString()} DH</span>
          </div>
        </div>

        <div className="stat-card stat-purple">
          <div className="stat-icon">{Icons.truck}</div>
          <div className="stat-content">
            <span className="stat-value">{camions.length}</span>
            <span className="stat-label">Camions</span>
          </div>
          <div className="stat-details">
            <span className="stat-detail">{camions.filter(c => c.statut === 'DISPONIBLE').length} disponibles</span>
          </div>
        </div>
      </div>

      {/* Sections détaillées */}
      <div className="rapports-sections">
        {/* Section Trajets */}
        <div className="rapport-section">
          <div className="section-header">
            <h2>{Icons.route} Rapport des Trajets</h2>
            <div className="header-buttons">
              <button className="btn btn-sm btn-primary" onClick={exportTrajetsCSV}>
                {Icons.download} CSV
              </button>
            </div>
          </div>
          
          <div className="section-content">
            <div className="chart-container">
              <h3>Répartition par statut</h3>
              <div className="chart-bars">
                <div className="chart-bar-item">
                  <div className="chart-bar-label">
                    <span className="dot dot-green"></span>
                    <span>Terminés</span>
                  </div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill bar-green" style={{ width: `${statsCalculees.trajets.total ? (statsCalculees.trajets.termines / statsCalculees.trajets.total) * 100 : 0}%` }}></div>
                  </div>
                  <span className="chart-bar-value">{statsCalculees.trajets.termines}</span>
                </div>
                <div className="chart-bar-item">
                  <div className="chart-bar-label">
                    <span className="dot dot-blue"></span>
                    <span>En cours</span>
                  </div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill bar-blue" style={{ width: `${statsCalculees.trajets.total ? (statsCalculees.trajets.enCours / statsCalculees.trajets.total) * 100 : 0}%` }}></div>
                  </div>
                  <span className="chart-bar-value">{statsCalculees.trajets.enCours}</span>
                </div>
                <div className="chart-bar-item">
                  <div className="chart-bar-label">
                    <span className="dot dot-gray"></span>
                    <span>Planifiés</span>
                  </div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill bar-gray" style={{ width: `${statsCalculees.trajets.total ? (statsCalculees.trajets.planifies / statsCalculees.trajets.total) * 100 : 0}%` }}></div>
                  </div>
                  <span className="chart-bar-value">{statsCalculees.trajets.planifies}</span>
                </div>
                <div className="chart-bar-item">
                  <div className="chart-bar-label">
                    <span className="dot dot-red"></span>
                    <span>Annulés</span>
                  </div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill bar-red" style={{ width: `${statsCalculees.trajets.total ? (statsCalculees.trajets.annules / statsCalculees.trajets.total) * 100 : 0}%` }}></div>
                  </div>
                  <span className="chart-bar-value">{statsCalculees.trajets.annules}</span>
                </div>
              </div>
            </div>

            {/* Tableau des derniers trajets */}
            <div className="table-container">
              <h3>Derniers trajets</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Itinéraire</th>
                    <th>Camion</th>
                    <th>Chauffeur</th>
                    <th>Distance</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrajets.slice(0, 10).map(trajet => (
                    <tr key={trajet._id}>
                      <td>{new Date(trajet.dateHeureDepart).toLocaleDateString('fr-FR')}</td>
                      <td className="itineraire">{trajet.lieuDepart} → {trajet.lieuArrivee}</td>
                      <td>{trajet.camion?.matricule || '-'}</td>
                      <td>{trajet.chauffeur ? `${trajet.chauffeur.prenom} ${trajet.chauffeur.nom}` : '-'}</td>
                      <td>{(trajet.kilometrageArrivee || 0) - (trajet.kilometrageDepart || 0)} km</td>
                      <td>
                        <span className={`status ${trajet.statut === 'TERMINE' ? 'status-ok' : trajet.statut === 'EN_COURS' ? 'status-busy' : trajet.statut === 'ANNULE' ? 'status-danger' : 'status-default'}`}>
                          {trajet.statut}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-icon btn-pdf" 
                          onClick={() => downloadTrajetPDF(trajet._id)}
                          title="Télécharger l'ordre de mission (PDF)"
                        >
                          {Icons.pdf}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTrajets.length === 0 && (
                    <tr><td colSpan="7" className="empty-row">Aucun trajet sur cette période</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section Flotte */}
        <div className="rapport-section">
          <div className="section-header">
            <h2>{Icons.truck} Rapport de la Flotte</h2>
            <div className="header-buttons">
              <button className="btn btn-sm btn-primary" onClick={exportFlotteCSV}>
                {Icons.download} Camions CSV
              </button>
              <button className="btn btn-sm btn-secondary" onClick={exportRemorquesCSV}>
                {Icons.download} Remorques CSV
              </button>
            </div>
          </div>
          
          <div className="section-content">
            <div className="fleet-stats">
              <div className="fleet-stat">
                <div className="fleet-stat-header">
                  <span>Camions</span>
                  <span className="fleet-stat-total">{camions.length}</span>
                </div>
                <div className="fleet-stat-bar">
                  <div className="fleet-bar-segment bar-green" style={{ width: `${camions.length ? (camions.filter(c => c.statut === 'DISPONIBLE').length / camions.length) * 100 : 0}%` }}></div>
                  <div className="fleet-bar-segment bar-blue" style={{ width: `${camions.length ? (camions.filter(c => c.statut === 'EN_MISSION').length / camions.length) * 100 : 0}%` }}></div>
                  <div className="fleet-bar-segment bar-orange" style={{ width: `${camions.length ? (camions.filter(c => c.statut === 'EN_MAINTENANCE').length / camions.length) * 100 : 0}%` }}></div>
                </div>
                <div className="fleet-legend">
                  <span><span className="dot dot-green"></span> Disponible ({camions.filter(c => c.statut === 'DISPONIBLE').length})</span>
                  <span><span className="dot dot-blue"></span> En mission ({camions.filter(c => c.statut === 'EN_MISSION').length})</span>
                  <span><span className="dot dot-orange"></span> Maintenance ({camions.filter(c => c.statut === 'EN_MAINTENANCE').length})</span>
                </div>
              </div>

              <div className="fleet-stat">
                <div className="fleet-stat-header">
                  <span>Remorques</span>
                  <span className="fleet-stat-total">{remorques.length}</span>
                </div>
                <div className="fleet-stat-bar">
                  <div className="fleet-bar-segment bar-green" style={{ width: `${remorques.length ? (remorques.filter(r => r.statut === 'DISPONIBLE').length / remorques.length) * 100 : 0}%` }}></div>
                  <div className="fleet-bar-segment bar-blue" style={{ width: `${remorques.length ? (remorques.filter(r => r.statut === 'EN_MISSION').length / remorques.length) * 100 : 0}%` }}></div>
                </div>
                <div className="fleet-legend">
                  <span><span className="dot dot-green"></span> Disponible ({remorques.filter(r => r.statut === 'DISPONIBLE').length})</span>
                  <span><span className="dot dot-blue"></span> En mission ({remorques.filter(r => r.statut === 'EN_MISSION').length})</span>
                </div>
              </div>
            </div>

            <div className="table-container">
              <h3>État des camions</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Marque / Modèle</th>
                    <th>Kilométrage</th>
                    <th>Carburant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {camions.slice(0, 10).map(camion => (
                    <tr key={camion._id}>
                      <td className="matricule">{camion.matricule}</td>
                      <td>{camion.marque} {camion.modele || camion.model}</td>
                      <td>{(camion.kilometrageActuel || 0).toLocaleString()} km</td>
                      <td>{camion.typeCarburant || '-'}</td>
                      <td>
                        <span className={`status ${camion.statut === 'DISPONIBLE' ? 'status-ok' : camion.statut === 'EN_MISSION' ? 'status-busy' : 'status-warning'}`}>
                          {camion.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section Carburant */}
        <div className="rapport-section">
          <div className="section-header">
            <h2>{Icons.fuel} Rapport Carburant</h2>
            <button className="btn btn-sm btn-primary" onClick={exportCarburantCSV}>
              {Icons.download} CSV
            </button>
          </div>
          
          <div className="section-content">
            <div className="carburant-summary">
              <div className="carburant-card">
                <span className="carburant-value">{statsCalculees.carburant.litres.toLocaleString()}</span>
                <span className="carburant-label">Litres consommés</span>
              </div>
              <div className="carburant-card">
                <span className="carburant-value">{statsCalculees.carburant.montant.toLocaleString()} DH</span>
                <span className="carburant-label">Montant total</span>
              </div>
              <div className="carburant-card">
                <span className="carburant-value">{statsCalculees.carburant.pleins}</span>
                <span className="carburant-label">Nombre de pleins</span>
              </div>
              <div className="carburant-card">
                <span className="carburant-value">
                  {statsCalculees.carburant.pleins > 0 
                    ? Math.round(statsCalculees.carburant.montant / statsCalculees.carburant.pleins).toLocaleString() 
                    : 0} DH
                </span>
                <span className="carburant-label">Coût moyen / plein</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapportsList;
