const mongoose = require('mongoose');
const typeCarburant = require('../enums/fuelTypes');

const pleinCarburantSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    quantiteLitre: {
        type: Number,
        required: true,
    },
    prixLitre: {
        type: Number,
        required: true,
    },
    montantTotal: {
        type: Number,
        required: true,
    },
    kilometrageCompteur: {
        type: Number,
        required: true
    },
    nomStation: {
        type: String,
        required: true
    },
    typeCarburant: {
        type: String,
        enum: Object.values(typeCarburant),
        required: true,
    },
    camion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camion',
        required: true
    }
}, {
    timestamps: true
});

const PleinCarburant = mongoose.model('PleinCarburant', pleinCarburantSchema);

module.exports = PleinCarburant;
