const RegleMaintenance = require('../models/RegleMaintenance');
const InterventionMaintenance = require('../models/InterventionMaintenance');
const Camion = require('../models/Camion');
const Trajet = require('../models/Trajet');

class MaintenanceService {
    async verifierMaintenancePreventive() {
        const camions = await Camion.find();
        const regles = await RegleMaintenance.find();
        const alertes = [];

        for (const camion of camions) {
            const dernierTrajet = await Trajet.findOne({ 
                camion: camion._id, 
                kilometrageArrivee: { $exists: true } 
            }).sort({ dateHeureArrivee: -1 });

            const kilometrageActuel = dernierTrajet?.kilometrageArrivee || 0;

            for (const regle of regles) {
                const derniereIntervention = await InterventionMaintenance.findOne({
                    camion: camion._id,
                    type: regle.typeIntervention
                }).sort({ dateIntervention: -1 });

                const kilometrageDerniereIntervention = derniereIntervention?.kilometrageVehicule || 0;
                const kilometrageDepuisIntervention = kilometrageActuel - kilometrageDerniereIntervention;

                if (kilometrageDepuisIntervention >= regle.intervalleKilometres) {
                    alertes.push({
                        camion: camion.matricule,
                        typeIntervention: regle.typeIntervention,
                        kilometrageActuel,
                        kilometrageDepuisIntervention,
                        intervalleRecommande: regle.intervalleKilometres,
                        priorite: kilometrageDepuisIntervention > regle.intervalleKilometres * 1.2 ? 'URGENT' : 'NORMAL'
                    });
                }
            }
        }

        return alertes;
    }

    async planifierMaintenance(camionId, typeIntervention, datePrevu) {
        return {
            camion: camionId,
            typeIntervention,
            datePrevu,
            statut: 'PLANIFIE'
        };
    }
}

module.exports = new MaintenanceService();