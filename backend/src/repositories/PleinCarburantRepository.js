const PleinCarburant = require('../models/PleinCarburant');

class PleinCarburantRepository {
    async create(data) {
        const plein = new PleinCarburant(data);
        return await plein.save();
    }

    async findAll(filter = {}) {
        return await PleinCarburant.find(filter)
            .populate('camion', 'matricule marque model')
            .sort({ date: -1 });
    }

    async findByCamion(camionId) {
        return await PleinCarburant.find({ camion: camionId })
            .populate('camion', 'matricule marque model')
            .sort({ date: -1 });
    }

    async findById(id) {
        return await PleinCarburant.findById(id)
            .populate('camion', 'matricule marque model');
    }

    async update(id, data) {
        return await PleinCarburant.findByIdAndUpdate(id, data, { new: true })
            .populate('camion', 'matricule marque model');
    }

    async delete(id) {
        return await PleinCarburant.findByIdAndDelete(id);
    }
}

module.exports = new PleinCarburantRepository();
