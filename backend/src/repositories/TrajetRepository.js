const Trajet = require('../models/Trajet');

class TrajetRepository {
    async create(trajetData) {
        const trajet = new Trajet(trajetData);
        return await trajet.save();
    }

    async findAll(filter = {}) {
        const trajets = await Trajet.find(filter)
            .populate('camion', 'matricule marque model')
            .populate('chauffeur', 'nom prenom telephone')
            .populate('remorque', 'matricule type')
            .lean();

        const statusPriority = {
            'RETARDE': 1,
            'EN_COURS': 2,
            'PLANIFIE': 3,
            'TERMINE': 4,
            'ANNULE': 5
        };

        return trajets.sort((a, b) => {
            const statusDiff = (statusPriority[a.statut] || 99) - (statusPriority[b.statut] || 99);
            if (statusDiff !== 0) return statusDiff;

            const dateA = new Date(a.dateHeureDepart);
            const dateB = new Date(b.dateHeureDepart);
            return dateA - dateB;
        });
    }

    async findByChauffeurId(id) {
        return await Trajet.find({ chauffeur: id })
            .populate('camion', 'matricule marque model')
            .populate('chauffeur', 'nom prenom telephone')
            .populate('remorque', 'matricule type');
    }

    async findByStatut(statut) {
        statut = statut.toUpperCase();
        return await Trajet.find({ statut })
            .populate('camion', 'matricule marque model')
            .populate('chauffeur', 'nom prenom telephone')
            .populate('remorque', 'matricule type');
    }

    async findById(id) {
        return await Trajet.findById(id)
            .populate('camion')
            .populate('chauffeur')
            .populate('remorque');
    }

    async update(id, updateData) {
        return await Trajet.findByIdAndUpdate(id, updateData, { new: true })
            .populate('camion', 'matricule marque model')
            .populate('chauffeur', 'nom prenom telephone')
            .populate('remorque', 'matricule type');
    }

    async delete(id) {
        return await Trajet.findByIdAndDelete(id);
    }
}

module.exports = new TrajetRepository();
