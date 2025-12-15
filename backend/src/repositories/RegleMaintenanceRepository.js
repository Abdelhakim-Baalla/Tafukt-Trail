const RegleMaintenance = require('../models/RegleMaintenance');

class RegleMaintenanceRepository {
  async findAll() {
    return RegleMaintenance.find();
  }

  async findById(id) {
    return RegleMaintenance.findById(id);
  }

  async findByTypeVehicule(typeVehicule) {
    return RegleMaintenance.find({ typeVehicule });
  }

  async findByTypeIntervention(typeIntervention) {
    return RegleMaintenance.find({ typeIntervention });
  }

  async create(data) {
    const regle = new RegleMaintenance(data);
    return regle.save();
  }

  async update(id, data) {
    return RegleMaintenance.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return RegleMaintenance.findByIdAndDelete(id);
  }
}

module.exports = new RegleMaintenanceRepository();
