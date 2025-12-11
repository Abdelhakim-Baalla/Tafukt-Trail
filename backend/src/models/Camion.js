const mongoose = require('mongoose');
const StatutVehicule = require('../enums/vehicleStatus');
const TypeCarburant = require('../enums/fuelTypes');

const camionSchema = new mongoose.Schema({
    marque: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    annee: {
        type: Number,
        required: true
    },
    statut: {
        type: String,
        enum: Object.values(StatutVehicule),
        default: StatutVehicule.DISPONIBLE
    },
    typeCarburant: {
        type: String,
        enum: Object.values(TypeCarburant),
        required: true
    },
    dateDernierControle: {
        type: Date
    },
    matricule: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    reservoire: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Camion = mongoose.model('Camion', camionSchema);

module.exports = Camion;
