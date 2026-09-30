const trajetRepository = require('../repositories/TrajetRepository');
const camionRepository = require('../repositories/CamionRepository');
const StatutTrajet = require('../enums/tripStatus');
const StatutVehicule = require('../enums/vehicleStatus');
const StatutChauffeur = require('../enums/status');
const Camion = require('../models/Camion');
const Remorque = require('../models/Remorque');
const Utilisateur = require('../models/Utilisateur');
const AppError = require('../utils/AppError');

const TRANSITIONS_STATUT = {
    [StatutTrajet.PLANIFIE]: [StatutTrajet.EN_COURS, StatutTrajet.ANNULE],
    [StatutTrajet.EN_COURS]: [StatutTrajet.TERMINE, StatutTrajet.RETARDE, StatutTrajet.ANNULE],
    [StatutTrajet.RETARDE]: [StatutTrajet.EN_COURS, StatutTrajet.ANNULE],
    [StatutTrajet.TERMINE]: [],
    [StatutTrajet.ANNULE]: [],
};

const getChauffeurId = (trajet) => String(trajet.chauffeur?._id ?? trajet.chauffeur);
const getCamionId = (trajet) => trajet.camion?._id ?? trajet.camion;
const getRemorqueId = (trajet) => trajet.remorque?._id ?? trajet.remorque;

const checkAccesTrajet = (trajet, user) => {
    if (!user) {
        throw new AppError('Accès non autorisé', 403);
    }
    if (user.role === 'ADMIN') {
        return;
    }
    if (user.role === 'CHAUFFEUR' && getChauffeurId(trajet) === String(user.id)) {
        return;
    }
    throw new AppError('Accès non autorisé', 403);
};

const assertTransitionValide = (statutActuel, nouveauStatut) => {
    if (nouveauStatut === undefined || nouveauStatut === null || nouveauStatut === statutActuel) {
        return;
    }
    if (!Object.values(StatutTrajet).includes(nouveauStatut)) {
        throw new AppError('Transition de statut invalide', 400);
    }
    const autorises = TRANSITIONS_STATUT[statutActuel] || [];
    if (!autorises.includes(nouveauStatut)) {
        throw new AppError('Transition de statut invalide', 400);
    }
};

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
    async checkDisponibilite(camionId, remorqueId, chauffeurId, data) {
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

        if(!data.kilometrageDepart){
            throw new Error('Kilometrage depart non fourni!');
        }

        if (!camion.reservoire){
            camion.reservoire = 0;
            await camion.save();
        }

        if(!data.carburantNiveauxDepart){
            throw new Error('Niveau de carburant depart non fourni!');
        }
    }

    async createTrajet(data) {
        // Verifier disponibilite
        await this.checkDisponibilite(data.camion, data.remorque, data.chauffeur, data);
        
        // Creer le trajet
        const trajet = await trajetRepository.create(data);
        
        // Mettre en mission
        await this.setEnMission(data.camion, data.remorque, data.chauffeur);
        
        return trajet;
    }

    async getAllTrajets(user) {
        if (!user) {
            throw new AppError('Accès non autorisé', 403);
        }
        let filter = {};
        if (user.role === 'CHAUFFEUR') {
            filter = { chauffeur: user.id };
        }
        return await trajetRepository.findAll(filter);
    }

    async getTrajetByChauffeurId(id, user) {
        if (!user) {
            throw new AppError('Accès non autorisé', 403);
        }
        if (user.role !== 'ADMIN' && String(id) !== String(user.id)) {
            throw new AppError('Accès non autorisé', 403);
        }
        return await trajetRepository.findByChauffeurId(id);
    }

    async getTrajetByStatut(statut) {
        return await trajetRepository.findByStatut(statut);
    }

    async getTrajetById(id, user) {
        if (!user) {
            throw new AppError('Accès non autorisé', 403);
        }
        const trajet = await trajetRepository.findById(id);
        if (!trajet) throw new AppError('Trajet non trouvé', 404);

        checkAccesTrajet(trajet, user);
        return trajet;
    }

    async updateTrajet(id, data, user) {
        if (!user) {
            throw new AppError('Accès non autorisé', 403);
        }
        const trajet = await trajetRepository.findById(id);
        if (!trajet) throw new AppError('Trajet non trouvé', 404);

        checkAccesTrajet(trajet, user);
        assertTransitionValide(trajet.statut, data.statut);
        return await trajetRepository.update(id, data);
    }

    async updateStatut(id, data, user) {
        if (!user) {
            throw new AppError('Accès non autorisé', 403);
        }
        const { statut, kilometrageArrivee, dateHeureArrivee, commentairesChauffeur, carburantNiveauxArrivee } = data;

        const trajet = await trajetRepository.findById(id);
        if (!trajet) throw new AppError('Trajet non trouvé', 404);

        checkAccesTrajet(trajet, user);
        assertTransitionValide(trajet.statut, statut);

        const updateData = {};
        if (statut != null) updateData.statut = statut;
        if (kilometrageArrivee != null) updateData.kilometrageArrivee = kilometrageArrivee;
        if (dateHeureArrivee != null) updateData.dateHeureArrivee = dateHeureArrivee;
        if (commentairesChauffeur != null) updateData.commentairesChauffeur = commentairesChauffeur;
        if (carburantNiveauxArrivee != null) updateData.carburantNiveauxArrivee = carburantNiveauxArrivee;

        const statutCible = statut != null ? statut : trajet.statut;

        if (statutCible === StatutTrajet.TERMINE) {
            const carburantArrivee = updateData.carburantNiveauxArrivee != null
                ? updateData.carburantNiveauxArrivee
                : trajet.carburantNiveauxArrivee;
            const dateArrivee = updateData.dateHeureArrivee != null
                ? updateData.dateHeureArrivee
                : trajet.dateHeureArrivee;
            const kilometrageFinal = updateData.kilometrageArrivee != null
                ? updateData.kilometrageArrivee
                : trajet.kilometrageArrivee;

            if (carburantArrivee == null) {
                throw new AppError('Niveau de carburant arrivee non fourni!', 400);
            }

            if (dateArrivee == null) {
                throw new AppError('Date et heure arrivee non fourni!', 400);
            } else if (new Date(dateArrivee) <= new Date(trajet.dateHeureDepart)) {
                throw new AppError('Date et heure arrivee inferieur ou egale a la date et heure depart!', 400);
            }

            if (kilometrageFinal == null) {
                throw new AppError('Kilometrage arrivee non fourni!', 400);
            } else if (kilometrageFinal <= trajet.kilometrageDepart) {
                throw new AppError('Kilometrage arrivee inferieur ou egale au kilometrage depart!', 400);
            } else if (kilometrageFinal - trajet.kilometrageDepart > 50000) {
                throw new AppError('Kilometrage arrivee incoherent (ecart superieur a 50 000 km)!', 400);
            }
        }

        const updatedTrajet = await trajetRepository.update(id, updateData);

        if (statut === StatutTrajet.TERMINE || statut === StatutTrajet.ANNULE) {
            await this.setDisponible(getCamionId(trajet), getRemorqueId(trajet), getChauffeurId(trajet));
        }

        if (statut === StatutTrajet.TERMINE) {
            const kilometrageFinal = updateData.kilometrageArrivee != null
                ? updateData.kilometrageArrivee
                : trajet.kilometrageArrivee;
            const camion = await camionRepository.findById(getCamionId(trajet));
            if (!camion) {
                throw new AppError('Camion non trouvé!', 404);
            }
            const actuel = camion.kilometrageActuel ?? 0;
            camion.kilometrageActuel = Math.max(actuel, kilometrageFinal);
            await camionRepository.update(camion._id ?? getCamionId(trajet), {
                kilometrageActuel: camion.kilometrageActuel
            });
        }

        return updatedTrajet;
    }

    async deleteTrajet(id, user) {
        if (!user) {
            throw new AppError('Accès non autorisé', 403);
        }
        const trajet = await trajetRepository.findById(id);
        if (!trajet) throw new AppError('Trajet non trouvé', 404);

        checkAccesTrajet(trajet, user);
        await this.setDisponible(getCamionId(trajet), getRemorqueId(trajet), getChauffeurId(trajet));
        return await trajetRepository.delete(id);
    }

    async generatePdf(id, user) {
        if (!user) {
            throw new AppError('Accès non autorisé', 403);
        }
        const trajet = await trajetRepository.findById(id);
        if (!trajet) throw new AppError('Trajet non trouvé', 404);

        checkAccesTrajet(trajet, user);
        return trajet;
    }
}

module.exports = new TrajetService();
