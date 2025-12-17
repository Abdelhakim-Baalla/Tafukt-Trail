const Pneu = require('../models/Pneu');

class PneuRepository {
    async create(data) {
        const pneu = new Pneu(data);
        return await pneu.save();
    }

    async findAll(filter = {}) {
        const pneus = await Pneu.find(filter)
            .populate('camion', 'matricule marque model')
            .lean();

        const positionPriority = {
            'AVANT_GAUCHE': 1,
            'AVANT_DROIT': 2,
            'ARRIERE_GAUCHE': 3,
            'ARRIERE_DROIT': 4,
            'ROULE_DE_SECOURS': 5
        };

        return pneus.sort((a, b) => {
            const camionCompare = (a.camion?.matricule || '').localeCompare(b.camion?.matricule || '');
            if (camionCompare !== 0) return camionCompare;

            return (positionPriority[a.position] || 99) - (positionPriority[b.position] || 99);
        });
    }

    async findByPosition(position) {
        position = position.toUpperCase();
        return await Pneu.find({ position }).populate('camion', 'matricule marque model');
    }

    async findById(id) {
        return await Pneu.findById(id).populate('camion', 'matricule marque model');
    }

    async update(id, data) {
        return await Pneu.findByIdAndUpdate(id, data, { new: true }).populate('camion', 'matricule marque model');
    }

    async delete(id) {
        return await Pneu.findByIdAndDelete(id);
    }
}

module.exports = new PneuRepository();
