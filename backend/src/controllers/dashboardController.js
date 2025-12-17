const Camion = require('../models/Camion');
const Trajet = require('../models/Trajet');
const Utilisateur = require('../models/Utilisateur');
const Remorque = require('../models/Remorque');
const PleinCarburant = require('../models/PleinCarburant');

exports.getStats = async (req, res) => {
  try {
    // Véhicules
    const totalCamions = await Camion.countDocuments() || 0;
    const camionsDisponibles = await Camion.countDocuments({ statut: 'DISPONIBLE' }) || 0;
    const totalRemorques = await Remorque.countDocuments() || 0;
    const remorquesDisponibles = await Remorque.countDocuments({ statut: 'DISPONIBLE' }) || 0;
    
    // Trajets
    const totalTrajets = await Trajet.countDocuments() || 0;
    const trajetsEnCours = await Trajet.countDocuments({ statut: 'EN_COURS' }) || 0;
    const trajetsPlanifies = await Trajet.countDocuments({ statut: 'PLANIFIE' }) || 0;
    const trajetsTermines = await Trajet.countDocuments({ statut: 'TERMINE' }) || 0;
    
    // Chauffeurs
    const totalChauffeurs = await Utilisateur.countDocuments({ role: 'CHAUFFEUR' }) || 0;
    const chauffeursDisponibles = await Utilisateur.countDocuments({ role: 'CHAUFFEUR', statut: 'DISPONIBLE' }) || 0;
    const chauffeursList = await Utilisateur.find({ role: 'CHAUFFEUR' }, 'nom prenom email telephone statut').limit(10);
    
    // Carburant
    const pleinsCarburant = await PleinCarburant.find().limit(100);
    const totalLitres = pleinsCarburant.reduce((sum, p) => sum + (p.quantiteLitre || 0), 0);
    const totalMontant = pleinsCarburant.reduce((sum, p) => sum + (p.montantTotal || 0), 0);
    
    // Derniers trajets
    const derniersTrajets = await Trajet.find()
      .populate('camion', 'matricule marque')
      .populate('chauffeur', 'nom prenom')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      vehicules: {
        camions: { total: totalCamions, disponibles: camionsDisponibles },
        remorques: { total: totalRemorques, disponibles: remorquesDisponibles }
      },
      trajets: {
        total: totalTrajets,
        enCours: trajetsEnCours,
        planifies: trajetsPlanifies,
        termines: trajetsTermines,
        derniers: derniersTrajets
      },
      chauffeurs: {
        total: totalChauffeurs,
        disponibles: chauffeursDisponibles,
        liste: chauffeursList
      },
      carburant: {
        totalLitres: Math.round(totalLitres),
        totalMontant: Math.round(totalMontant),
        nombrePleins: pleinsCarburant.length
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      vehicules: { camions: { total: 0, disponibles: 0 }, remorques: { total: 0, disponibles: 0 } },
      trajets: { total: 0, enCours: 0, planifies: 0, termines: 0, derniers: [] },
      chauffeurs: { total: 0, disponibles: 0, liste: [] },
      carburant: { totalLitres: 0, totalMontant: 0, nombrePleins: 0 }
    });
  }
};