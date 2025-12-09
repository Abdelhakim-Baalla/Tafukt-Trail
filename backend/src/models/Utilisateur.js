const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const RoleUtilisateur = require('../enums/roles');
const StatutChauffeur = require('../enums/status');

const utilisateurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    prenom: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    motDePasse: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(RoleUtilisateur),
        default: RoleUtilisateur.CHAUFFEUR
    },
    telephone: {
        type: String,
        required: true
    },
    statut: {
        type: String,
        enum: Object.values(StatutChauffeur),
        default: StatutChauffeur.DISPONIBLE
    },
    dateEmbauche: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


// le hashage de mot de passe avant de sauvergadrer
utilisateurSchema.pre('save', async function() {
    if (!this.isModified('motDePasse')) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    } catch (error) {
        throw error;
    }
});


const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;
