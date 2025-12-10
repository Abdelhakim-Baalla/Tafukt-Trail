const Remorque = require('../models/Remorque');

class RemorqueRepository {
    async create(data) {
        const remorque = new Remorque(data);
        return await remorque.save();
    }

    async findAll(filter = {}) {
        const remorques = await Remorque.find(filter)
            .populate('camion', 'matricule marque model')
            .lean();

        const statusPriority = {
            'HORS_SERVICE': 5,
            'EN_MAINTENANCE': 4,
            'RESERVE': 3,
            'EN_MISSION': 2,
            'DISPONIBLE': 1
        };

        return remorques.sort((a, b) => {
            const statusDiff = (statusPriority[a.statut] || 99) - (statusPriority[b.statut] || 99);
            if (statusDiff !== 0) return statusDiff;
        });
    }

    async findByStatut(statut) {
        statut = statut.toUpperCase();
        return await Remorque.find({ statut }).populate('camion', 'matricule marque model');
    }

    async findById(id) {
        return await Remorque.findById(id).populate('camion', 'matricule marque model');
    }

    async update(id, data) {
        return await Remorque.findByIdAndUpdate(id, data, { new: true }).populate('camion', 'matricule marque model');
    }

    async delete(id) {
        return await Remorque.findByIdAndDelete(id);
    }
}

module.exports = new RemorqueRepository();
