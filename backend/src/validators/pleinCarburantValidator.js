const Joi = require('joi');
const TypeCarburant = require('../enums/fuelTypes');

const validatePleinCarburant = (req, res, next) => {
    const schema = Joi.object({
        date: Joi.date().required(),
        quantiteLitre: Joi.number().required(),
        prixLitre: Joi.number().required(),
        montantTotal: Joi.number().required(),
        kilometrageCompteur: Joi.number().required(),
        nomStation: Joi.string().required(),
        typeCarburant: Joi.string().valid(...Object.values(TypeCarburant)).required(),
        camion: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validatePleinCarburantUpdate = (req, res, next) => {
    const schema = Joi.object({
        date: Joi.date().optional(),
        quantiteLitre: Joi.number().optional(),
        prixLitre: Joi.number().optional(),
        montantTotal: Joi.number().optional(),
        kilometrageCompteur: Joi.number().optional(),
        nomStation: Joi.string().optional(),
        typeCarburant: Joi.string().valid(...Object.values(TypeCarburant)).optional(),
        camion: Joi.string().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validatePleinCarburant, validatePleinCarburantUpdate };
