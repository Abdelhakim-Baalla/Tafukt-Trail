const Joi = require('joi');
const TypeRemorque = require('../enums/trailerTypes');
const StatutVehicule = require('../enums/vehicleStatus');

const validateRemorque = (req, res, next) => {
    const schema = Joi.object({
        type: Joi.string().valid(...Object.values(TypeRemorque)).required(),
        capaciteTonnes: Joi.number().required(),
        statut: Joi.string().valid(...Object.values(StatutVehicule)).default(StatutVehicule.DISPONIBLE),
        dateDernierVerification: Joi.date().optional(),
        matricule: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateRemorqueUpdate = (req, res, next) => {
    const schema = Joi.object({
        type: Joi.string().valid(...Object.values(TypeRemorque)).optional(),
        capaciteTonnes: Joi.number().optional(),
        statut: Joi.string().valid(...Object.values(StatutVehicule)).optional(),
        dateDernierVerification: Joi.date().optional(),
        matricule: Joi.string().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validateRemorque, validateRemorqueUpdate };
