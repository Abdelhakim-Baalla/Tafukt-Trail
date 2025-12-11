const mongoose = require('mongoose');
const StatutTrajet = require('../enums/tripStatus');

const trajetSchema = new mongoose.Schema({
    camion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camion',
        required: true
    },
    chauffeur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    remorque: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Remorque'
    },
    lieuDepart: {
        type: String,
        required: true
    },
    lieuArrivee: {
        type: String,
        required: true
    },
    dateHeureDepart: {
        type: Date,
        required: true
    },
    dateHeureArrivee: {
        type: Date
    },
    statut: {
        type: String,
        enum: Object.values(StatutTrajet),
        default: StatutTrajet.PLANIFIE
    },
    kilometrageDepart: {
        type: Number,
        required: true
    },
    kilometrageArrivee: {
        type: Number
    },
    commentairesChauffeur: {
        type: String
    },
    notesAdministratives: {
        type: String
    },
    urlPDF: {
        type: String
    },
    carburantNiveauxDepart: {
        type: Number
    },
    carburantNiveauxArrivee: {
        type: Number
    }
}, {
    timestamps: true
});

// Method to calculate distance
trajetSchema.methods.calculerDistance = function() {
    if (this.kilometrageArrivee && this.kilometrageDepart) {
        return this.kilometrageArrivee - this.kilometrageDepart;
    }
    return 0;
};

const Trajet = mongoose.model('Trajet', trajetSchema);

module.exports = Trajet;
