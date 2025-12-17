const jwt = require('jsonwebtoken');

// Vérification du JWT
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
};

// Contrôle des rôles
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès interdit. Vous n\'avez pas les droits nécessaires.' });
        }

        next();
    };
};

module.exports = { authenticate, authorize };
