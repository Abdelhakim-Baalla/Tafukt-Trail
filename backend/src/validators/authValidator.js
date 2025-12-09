const Joi = require('joi');
const RoleUtilisateur = require('../enums/roles');
const StatutChauffeur = require('../enums/status');

const validateRegister = (req, res, next) => {
    const schema = Joi.object({
        nom: Joi.string().min(2).max(50).required(),
        prenom: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        motDePasse: Joi.string().min(6).required(),
        role: Joi.string().valid(...Object.values(RoleUtilisateur)).default(RoleUtilisateur.CHAUFFEUR),
        telephone: Joi.string().pattern(/^[0-9+]{10,15}$/).required(),
        statut: Joi.string().valid(...Object.values(StatutChauffeur)).default(StatutChauffeur.DISPONIBLE),
        dateEmbauche: Joi.date().default(Date.now)
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        motDePasse: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validateRegister, validateLogin };
