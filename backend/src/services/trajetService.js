const trajetRepository = require('../repositories/TrajetRepository');

class TrajetService {
    async createTrajet(data) {
        return await trajetRepository.create(data);
    }

    async getAllTrajets(user) {
        let filter = {};
        
        if (user.role === 'CHAUFFEUR') {
            filter = { chauffeur: user.id };
        }
        return await trajetRepository.findAll(filter);
    }

    async getTrajetById(id, user) {
        const trajet = await trajetRepository.findById(id);
        const userRole = user.role;

        if (!trajet) {
            throw new Error('Trajet non trouvé');
        }

        if (userRole === 'ADMIN') {
            return trajet;
        }

        if (userRole === 'CHAUFFEUR' && trajet.chauffeur.toString() === user.id) {
            return trajet;
        }

        throw new Error('Accès non autorisé');
    }

    async updateTrajet(id, data, user) {
        const trajet = await trajetRepository.findById(id);
        const userRole = user.role;

        if (!trajet) {
            throw new Error('Trajet non trouvé');
        }

        if (userRole === 'ADMIN' || (userRole === 'CHAUFFEUR' && trajet.chauffeur._id.toString() === user.id)) {
            return await trajetRepository.update(id, data);
        }

        throw new Error('Accès non autorisé');
    }

    async updateStatut(id, data, user) {
        const { statut, kilometrageArrivee, dateHeureArrivee, commentairesChauffeur } = data;
        const updateData = {};
        if (statut) updateData.statut = statut;
        if (kilometrageArrivee) updateData.kilometrageArrivee = kilometrageArrivee;
        if (dateHeureArrivee) updateData.dateHeureArrivee = dateHeureArrivee;
        if (commentairesChauffeur) updateData.commentairesChauffeur = commentairesChauffeur;

        const trajet = await trajetRepository.findById(id);
        const userRole = user.role;

        if (!trajet) {
            throw new Error('Trajet non trouvé');
        }

        if (userRole === 'ADMIN' || (userRole === 'CHAUFFEUR' && trajet.chauffeur._id.toString() === user.id)) {
            return await trajetRepository.update(id, updateData);
        }

        throw new Error('Accès non autorisé');
    }

    async deleteTrajet(id, user) {
        const trajet = await trajetRepository.findById(id);
        const userRole = user.role;

        if (!trajet) {
            throw new Error('Trajet non trouvé');
        }

        if (userRole === 'ADMIN' || (userRole === 'CHAUFFEUR' && trajet.chauffeur._id.toString() === user.id)) {
            return await trajetRepository.delete(id);
        }

        throw new Error('Accès non autorisé');
    }
}

module.exports = new TrajetService();
