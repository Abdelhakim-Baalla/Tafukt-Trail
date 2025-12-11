const Joi = require('joi');
const StatutVehicule = require('../enums/vehicleStatus');
const TypeCarburant = require('../enums/fuelTypes');

const validateCamion = (req, res, next) => {
    const schema = Joi.object({
        marque: Joi.string().required(),
        model: Joi.string().required(),
        annee: Joi.number().required(),
        statut: Joi.string().valid(...Object.values(StatutVehicule)).default(StatutVehicule.DISPONIBLE),
        typeCarburant: Joi.string().valid(...Object.values(TypeCarburant)).required(),
        dateDernierControle: Joi.date().optional(),
        matricule: Joi.string().required(),
        reservoire: Joi.number().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateCamionUpdate = (req, res, next) => {
    const schema = Joi.object({
        marque: Joi.string().optional(),
        model: Joi.string().optional(),
        annee: Joi.number().optional(),
        statut: Joi.string().valid(...Object.values(StatutVehicule)).optional(),
        typeCarburant: Joi.string().valid(...Object.values(TypeCarburant)).optional(),
        dateDernierControle: Joi.date().optional(),
        matricule: Joi.string().optional(),
        reservoire: Joi.number().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validateCamion, validateCamionUpdate };
