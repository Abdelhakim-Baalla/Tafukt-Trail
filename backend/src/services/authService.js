const jwt = require('jsonwebtoken');
const utilisateurRepository = require('../repositories/UtilisateurRepository');
const bcrypt = require('bcrypt');
class AuthService {
    async register(userData) {
        const existingUser = await utilisateurRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Un utilisateur avec cet email existe déjàa.');
        }
        
        return await utilisateurRepository.create(userData);
    }

    async login(email, motDePasse) {
        const user = await utilisateurRepository.findByEmail(email);
        
        if (!user) {
            throw new Error('Email ou mot de passe incorrect.');
        }

        const isValid = await this.comparePassword(motDePasse, user.motDePasse);
        if (!isValid) {
            throw new Error('Email ou mot de passe incorrect.');
        }
        const token = this.generateToken(user);

        return { user, token };
    }

    generateToken(user) {
        return jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
    }

    comparePassword(candidatePassword, motDePasse) {
        return bcrypt.compare(candidatePassword, motDePasse);
    }
}

module.exports = new AuthService();
