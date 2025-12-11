const Joi = require('joi');
const StatutTrajet = require('../enums/tripStatus');

const validateTrajet = (req, res, next) => {
    const schema = Joi.object({
        camion: Joi.string().required(),
        chauffeur: Joi.string().required(),
        remorque: Joi.string().optional(),
        lieuDepart: Joi.string().required(),
        lieuArrivee: Joi.string().required(),
        dateHeureDepart: Joi.date().required(),
        dateHeureArrivee: Joi.date().optional(),
        kilometrageDepart: Joi.number().required(),
        kilometrageArrivee: Joi.number().optional(),
        statut: Joi.string().valid(...Object.values(StatutTrajet)).default(StatutTrajet.PLANIFIE),
        commentairesChauffeur: Joi.string().optional(),
        notesAdministratives: Joi.string().optional(),
        carburantNiveauxDepart: Joi.number().optional(),
        carburantNiveauxArrivee: Joi.number().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validateTrajet };
