const Trajet = require('../models/Trajet');

class TrajetRepository {
    async create(trajetData) {
        const trajet = new Trajet(trajetData);
        return await trajet.save();
    }

    async findAll(filter = {}) {
        return await Trajet.find(filter)
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
