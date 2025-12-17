const InterventionMaintenanceRepository = require('../repositories/InterventionMaintenanceRepository');
const RegleMaintenanceRepository = require('../repositories/RegleMaintenanceRepository');
const CamionRepository = require('../repositories/CamionRepository');
const TrajetRepository = require('../repositories/TrajetRepository');
const Camion = require('../models/Camion');
const Trajet = require('../models/Trajet');

class MaintenanceService {
  // ==================== INTERVENTIONS ====================

  async getAllInterventions() {
    return InterventionMaintenanceRepository.findAll();
  }

  async getInterventionById(id) {
    return InterventionMaintenanceRepository.findById(id);
  }

  async getInterventionsByCamion(camionId) {
    return InterventionMaintenanceRepository.findByCamion(camionId);
  }

  async createIntervention(data) {
    return InterventionMaintenanceRepository.create(data);
  }

  async updateIntervention(id, data) {
    return InterventionMaintenanceRepository.update(id, data);
  }

  async deleteIntervention(id) {
    return InterventionMaintenanceRepository.delete(id);
  }

  // ==================== REGLES ====================

  async getAllRegles() {
    return RegleMaintenanceRepository.findAll();
  }

  async getRegleById(id) {
    return RegleMaintenanceRepository.findById(id);
  }

  async createRegle(data) {
    return RegleMaintenanceRepository.create(data);
  }

  async updateRegle(id, data) {
    return RegleMaintenanceRepository.update(id, data);
  }

  async deleteRegle(id) {
    return RegleMaintenanceRepository.delete(id);
  }

  // ==================== ALERTES ====================

  async verifierMaintenancePreventive() {
    const camions = await Camion.find();
    const regles = await RegleMaintenanceRepository.findAll();
    const alertes = [];

    for (const camion of camions) {
      const dernierTrajet = await Trajet.findOne({
        camion: camion._id,
        kilometrageArrivee: { $exists: true },
      }).sort({ dateHeureArrivee: -1 });

      const kilometrageActuel = dernierTrajet?.kilometrageArrivee || 0;

      for (const regle of regles) {
        const derniereIntervention =
          await InterventionMaintenanceRepository.getLastIntervention(
            camion._id,
            regle.typeIntervention
          );

        const kilometrageDerniereIntervention =
          derniereIntervention?.kilometrageVehicule || 0;
        const kilometrageDepuisIntervention =
          kilometrageActuel - kilometrageDerniereIntervention;

        if (kilometrageDepuisIntervention >= regle.intervalleKilometres) {
          alertes.push({
            camion: camion.matricule,
            camionId: camion._id,
            typeIntervention: regle.typeIntervention,
            kilometrageActuel,
            kilometrageDepuisIntervention,
            intervalleRecommande: regle.intervalleKilometres,
            priorite:
              kilometrageDepuisIntervention > regle.intervalleKilometres * 1.2
                ? 'URGENT'
                : 'NORMAL',
          });
        }
      }
    }

    return alertes;
  }

  async planifierMaintenance(camionId, typeIntervention, datePrevu) {
    // Créer une intervention planifiée
    const camion = await Camion.findById(camionId);
    if (!camion) {
      throw new Error('Camion non trouvé');
    }

    const dernierTrajet = await Trajet.findOne({
      camion: camionId,
      kilometrageArrivee: { $exists: true },
    }).sort({ dateHeureArrivee: -1 });

    const kilometrageActuel = dernierTrajet?.kilometrageArrivee || 0;

    const intervention = await InterventionMaintenanceRepository.create({
      type: typeIntervention,
      description: `Maintenance planifiée - ${typeIntervention}`,
      dateIntervention: new Date(datePrevu),
      cout: 0,
      kilometrageVehicule: kilometrageActuel,
      camion: camionId,
    });

    return intervention;
  }
}

module.exports = new MaintenanceService();
