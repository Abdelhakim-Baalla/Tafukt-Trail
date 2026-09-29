const Joi = require('joi');
const PositionPneu = require('../enums/tirePositions');

const validatePneu = (req, res, next) => {
    const schema = Joi.object({
        numeroSerie: Joi.string().required(),
        marque: Joi.string().required(),
        modele: Joi.string().required(),
        dimension: Joi.string().required(),
        position: Joi.string().valid(...Object.values(PositionPneu)).required(),
        datePose: Joi.date().optional(),
        pressionRecommandee: Joi.number().required(),
        camion: Joi.string().required(),
        usurePourcent: Joi.number().min(0).max(100).optional(),
        kilometragePose: Joi.number().min(0).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validatePneuUpdate = (req, res, next) => {
    const schema = Joi.object({
        numeroSerie: Joi.string().optional(),
        marque: Joi.string().optional(),
        modele: Joi.string().optional(),
        dimension: Joi.string().optional(),
        position: Joi.string().valid(...Object.values(PositionPneu)).optional(),
        datePose: Joi.date().optional(),
        pressionRecommandee: Joi.number().optional(),
        camion: Joi.string().optional(),
        usurePourcent: Joi.number().min(0).max(100).optional(),
        kilometragePose: Joi.number().min(0).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validatePneu, validatePneuUpdate };
