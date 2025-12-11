const Camion = require('../models/Camion');

class CamionRepository {
    async create(data) {
        const camion = new Camion(data);
        return await camion.save();
    }

    async findAll(filter = {}) {
        const camions = await Camion.find(filter).lean();

        const statusPriority = {
            'HORS_SERVICE': 5,
            'EN_MAINTENANCE': 4,
            'RESERVE': 3,
            'EN_MISSION': 2,
            'DISPONIBLE': 1
        };

        return camions.sort((a, b) => {
            const statusDiff = (statusPriority[a.statut] || 99) - (statusPriority[b.statut] || 99);
            if (statusDiff !== 0) return statusDiff;

            return (a.matricule || '').localeCompare(b.matricule || '');
        });
    }

    async findByStatut(statut) {
        statut = statut.toUpperCase();
        return await Camion.find({ statut });
    }

    async findById(id) {
        return await Camion.findById(id);
    }

    async update(id, data) {
        return await Camion.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Camion.findByIdAndDelete(id);
    }
}

module.exports = new CamionRepository();
