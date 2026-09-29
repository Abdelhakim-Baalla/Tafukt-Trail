const mongoose = require('mongoose');
const PositionPneu = require('../enums/tirePositions');

const pneuSchema = new mongoose.Schema({
    numeroSerie: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    marque: {
        type: String,
        required: true,
        trim: true
    },
    modele: {
        type: String,
        required: true,
        trim: true
    },
    dimension: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        enum: Object.values(PositionPneu),
        required: true
    },
    datePose: {
        type: Date
    },
    pressionRecommandee: {
        type: Number,
        required: true
    },
    camion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camion',
        required: true
    },
    usurePourcent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    kilometragePose: {
        type: Number,
        min: 0
    }
}, {
    timestamps: true
});

const Pneu = mongoose.model('Pneu', pneuSchema);

module.exports = Pneu;
