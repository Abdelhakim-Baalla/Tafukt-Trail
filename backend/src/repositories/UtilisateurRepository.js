const Utilisateur = require('../models/Utilisateur');

class UtilisateurRepository {
    async create(userData) {
        const utilisateur = new Utilisateur(userData);
        return await utilisateur.save();
    }

    async findByEmail(email) {
        return await Utilisateur.findOne({ email });
    }

    async findById(id) {
        return await Utilisateur.findById(id).select('-motDePasse');
    }
}

module.exports = new UtilisateurRepository();
