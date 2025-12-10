const mongoose = require('mongoose');
const TypeMaintenance = require('../enums/maintenanceTypes');

const interventionMaintenanceSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: Object.values(TypeMaintenance),
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateIntervention: {
        type: Date,
        required: true
    },
    cout: {
        type: Number,
        required: true
    },
    kilometrageVehicule: {
        type: Number,
        required: true
    },
    numeroFacture: {
        type: String
    },
    camion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camion',
        required: true
    }
}, {
    timestamps: true
});

const InterventionMaintenance = mongoose.model('InterventionMaintenance', interventionMaintenanceSchema);

module.exports = InterventionMaintenance;
