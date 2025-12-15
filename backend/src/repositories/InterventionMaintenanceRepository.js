const InterventionMaintenance = require('../models/InterventionMaintenance');

class InterventionMaintenanceRepository {
  async findAll() {
    return InterventionMaintenance.find().populate(
      'camion',
      'matricule marque model'
    );
  }

  async findById(id) {
    return InterventionMaintenance.findById(id).populate(
      'camion',
      'matricule marque model'
    );
  }

  async findByCamion(camionId) {
    return InterventionMaintenance.find({ camion: camionId }).populate(
      'camion',
      'matricule marque model'
    );
  }

  async findByType(type) {
    return InterventionMaintenance.find({ type }).populate(
      'camion',
      'matricule marque model'
    );
  }

  async create(data) {
    const intervention = new InterventionMaintenance(data);
    await intervention.save();
    return intervention.populate('camion', 'matricule marque model');
  }

  async update(id, data) {
    return InterventionMaintenance.findByIdAndUpdate(id, data, {
      new: true,
    }).populate('camion', 'matricule marque model');
  }

  async delete(id) {
    return InterventionMaintenance.findByIdAndDelete(id);
  }

  async getLastIntervention(camionId, type) {
    return InterventionMaintenance.findOne({
      camion: camionId,
      type,
    }).sort({ dateIntervention: -1 });
  }
}

module.exports = new InterventionMaintenanceRepository();
