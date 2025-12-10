const mongoose = require('mongoose');
const StatutVehicule = require('../enums/vehicleStatus');
const TypeRemorque = require('../enums/trailerTypes');

const remorqueSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: Object.values(TypeRemorque),
        required: true
    },
    capaciteTonnes: {
        type: Number,
        required: true
    },
    statut: {
        type: String,
        enum: Object.values(StatutVehicule),
        default: StatutVehicule.DISPONIBLE
    },
    dateDernierVerification: {
        type: Date
    },
    matricule: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

const Remorque = mongoose.model('Remorque', remorqueSchema);

module.exports = Remorque;
