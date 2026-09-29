const Joi = require('joi');
const TypeMaintenance = require('../enums/maintenanceTypes');
const TypeVehicule = require('../enums/vehicleTypes');

const validateIntervention = (req, res, next) => {
    const schema = Joi.object({
        type: Joi.string()
            .valid(...Object.values(TypeMaintenance))
            .required(),
        description: Joi.string().required(),
        dateIntervention: Joi.date().required(),
        cout: Joi.number().min(0).required(),
        kilometrageVehicule: Joi.number().min(0).required(),
        camion: Joi.string().hex().length(24).required(),
        numeroFacture: Joi.string().optional().allow('', null),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateInterventionUpdate = (req, res, next) => {
    const schema = Joi.object({
        type: Joi.string()
            .valid(...Object.values(TypeMaintenance))
            .optional(),
        description: Joi.string().optional(),
        dateIntervention: Joi.date().optional(),
        cout: Joi.number().min(0).optional(),
        kilometrageVehicule: Joi.number().min(0).optional(),
        camion: Joi.string().hex().length(24).optional(),
        numeroFacture: Joi.string().optional().allow('', null),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateRegle = (req, res, next) => {
    const schema = Joi.object({
        typeVehicule: Joi.string()
            .valid(...Object.values(TypeVehicule))
            .required(),
        typeIntervention: Joi.string()
            .valid(...Object.values(TypeMaintenance))
            .required(),
        intervalleKilometres: Joi.number().min(1).required(),
        description: Joi.string().optional().allow('', null),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateRegleUpdate = (req, res, next) => {
    const schema = Joi.object({
        typeVehicule: Joi.string()
            .valid(...Object.values(TypeVehicule))
            .optional(),
        typeIntervention: Joi.string()
            .valid(...Object.values(TypeMaintenance))
            .optional(),
        intervalleKilometres: Joi.number().min(1).optional(),
        description: Joi.string().optional().allow('', null),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    validateIntervention,
    validateInterventionUpdate,
    validateRegle,
    validateRegleUpdate,
};
