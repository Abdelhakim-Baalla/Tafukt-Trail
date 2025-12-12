const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const { user, token } = await authService.register(req.body);
            const { motDePasse, ...userResponse } = user.toObject();

            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                token,
                user: userResponse
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, motDePasse } = req.body;
            const { user, token } = await authService.login(email, motDePasse);
            const { motDePasse: passwordHash, ...userResponse } = user.toObject();

            res.status(200).json({
                message: 'Connexion réussie',
                token,
                user: userResponse
            });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();
