const mongoose = require('mongoose');
const TypeVehicule = require('../enums/vehicleTypes');
const TypeMaintenance = require('../enums/maintenanceTypes');

const regleMaintenanceSchema = new mongoose.Schema({
    typeVehicule: {
        type: String,
        enum: Object.values(TypeVehicule),
        required: true
    },
    typeIntervention: {
        type: String,
        enum: Object.values(TypeMaintenance),
        required: true
    },
    intervalleKilometres: {
        type: Number,
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

const RegleMaintenance = mongoose.model('RegleMaintenance', regleMaintenanceSchema);

module.exports = RegleMaintenance;
