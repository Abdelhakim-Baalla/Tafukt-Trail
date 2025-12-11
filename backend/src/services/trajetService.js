const trajetRepository = require('../repositories/TrajetRepository');
const StatutTrajet = require('../enums/tripStatus');
const StatutVehicule = require('../enums/vehicleStatus');
const StatutChauffeur = require('../enums/status');
const Camion = require('../models/Camion');
const Remorque = require('../models/Remorque');
const Utilisateur = require('../models/Utilisateur');

class TrajetService {
    // Mettre camion, remorque et chauffeur EN_MISSION
    async setEnMission(camionId, remorqueId, chauffeurId) {
        await Camion.findByIdAndUpdate(camionId, { statut: StatutVehicule.EN_MISSION });
        if (remorqueId) await Remorque.findByIdAndUpdate(remorqueId, { statut: StatutVehicule.EN_MISSION });
        await Utilisateur.findByIdAndUpdate(chauffeurId, { statut: StatutChauffeur.EN_MISSION });
    }

    // Remettre camion, remorque et chauffeur DISPONIBLE
    async setDisponible(camionId, remorqueId, chauffeurId) {
        await Camion.findByIdAndUpdate(camionId, { statut: StatutVehicule.DISPONIBLE });
        if (remorqueId) await Remorque.findByIdAndUpdate(remorqueId, { statut: StatutVehicule.DISPONIBLE });
        await Utilisateur.findByIdAndUpdate(chauffeurId, { statut: StatutChauffeur.DISPONIBLE });
    }

    // Verifier si camion, remorque et chauffeur sont disponibles
    async checkDisponibilite(camionId, remorqueId, chauffeurId) {
        const camion = await Camion.findById(camionId);
        if (!camion || camion.statut !== StatutVehicule.DISPONIBLE) {
            throw new Error('Camion non disponible');
        }

        if (remorqueId) {
            const remorque = await Remorque.findById(remorqueId);
            if (!remorque || remorque.statut !== StatutVehicule.DISPONIBLE) {
                throw new Error('Remorque non disponible');
            }
        }

        const chauffeur = await Utilisateur.findById(chauffeurId);
        if (!chauffeur || chauffeur.statut !== StatutChauffeur.DISPONIBLE) {
            throw new Error('Chauffeur non disponible');
        }
    }

    async createTrajet(data) {
        // Verifier disponibilite
        await this.checkDisponibilite(data.camion, data.remorque, data.chauffeur);
        
        // Creer le trajet
        const trajet = await trajetRepository.create(data);
        
        // Mettre en mission
        await this.setEnMission(data.camion, data.remorque, data.chauffeur);
        
        return trajet;
    }

    async getAllTrajets(user) {
        let filter = {};
        if (user.role === 'CHAUFFEUR') {
            filter = { chauffeur: user.id };
        }
        return await trajetRepository.findAll(filter);
    }

    async getTrajetByChauffeurId(id) {
        return await trajetRepository.findByChauffeurId(id);
    }

    async getTrajetByStatut(statut) {
        return await trajetRepository.findByStatut(statut);
    }

    async getTrajetById(id, user) {
        const trajet = await trajetRepository.findById(id);
        if (!trajet) throw new Error('Trajet non trouvé');

        if (user.role === 'ADMIN') return trajet;
        if (user.role === 'CHAUFFEUR' && trajet.chauffeur.toString() === user.id) return trajet;

        throw new Error('Accès non autorisé');
    }

    async updateTrajet(id, data, user) {
        const trajet = await trajetRepository.findById(id);
        if (!trajet) throw new Error('Trajet non trouvé');

        if (user.role === 'ADMIN' || (user.role === 'CHAUFFEUR' && trajet.chauffeur._id.toString() === user.id)) {
            return await trajetRepository.update(id, data);
        }

        throw new Error('Accès non autorisé');
    }

    async updateStatut(id, data, user) {
        const { statut, kilometrageArrivee, dateHeureArrivee, commentairesChauffeur, carburantNiveauxArrivee } = data;
        const updateData = {};
        if (statut) updateData.statut = statut;
        if (kilometrageArrivee) updateData.kilometrageArrivee = kilometrageArrivee;
        if (dateHeureArrivee) updateData.dateHeureArrivee = dateHeureArrivee;
        if (commentairesChauffeur) updateData.commentairesChauffeur = commentairesChauffeur;
        if (carburantNiveauxArrivee) updateData.carburantNiveauxArrivee = carburantNiveauxArrivee;

        const trajet = await trajetRepository.findById(id);
        if (!trajet) throw new Error('Trajet non trouvé');

        if (user.role === 'ADMIN' || (user.role === 'CHAUFFEUR' && trajet.chauffeur._id.toString() === user.id)) {
            const updatedTrajet = await trajetRepository.update(id, updateData);
            
            if (statut === StatutTrajet.TERMINE || statut === StatutTrajet.ANNULE) {
                await this.setDisponible(trajet.camion._id, trajet.remorque?._id, trajet.chauffeur._id);
            }
            
            return updatedTrajet;
        }

        throw new Error('Accès non autorisé');
    }

    async deleteTrajet(id, user) {
        const trajet = await trajetRepository.findById(id);
        if (!trajet) throw new Error('Trajet non trouvé');

        if (user.role === 'ADMIN' || (user.role === 'CHAUFFEUR' && trajet.chauffeur._id.toString() === user.id)) {
            await this.setDisponible(trajet.camion._id, trajet.remorque?._id, trajet.chauffeur._id);
            return await trajetRepository.delete(id);
        }

        throw new Error('Accès non autorisé');
    }

    async generatePdf(id, user) {
        const trajet = await trajetRepository.findById(id);
        if (!trajet) throw new Error('Trajet non trouvé');

        if (user.role === 'ADMIN' || (user.role === 'CHAUFFEUR' && trajet.chauffeur._id.toString() === user.id)) {
            return trajet;
        }

        throw new Error('Accès non autorisé');
    }
}

module.exports = new TrajetService();
