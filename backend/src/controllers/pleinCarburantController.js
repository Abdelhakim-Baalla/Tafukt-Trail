const pleinCarburantService = require('../services/pleinCarburantService');

exports.createPlein = async (req, res) => {
    try {
        const data = { ...req.body, chauffeur: req.user.id };
        const plein = await pleinCarburantService.createPlein(data);
        res.status(201).json(plein);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getMyPleins = async (req, res) => {
    try {
        const pleins = await pleinCarburantService.getPleinsByChauffeur(req.user.id);
        res.status(200).json(pleins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPleins = async (req, res) => {
    try {
        const pleins = await pleinCarburantService.getAllPleins();
        res.status(200).json(pleins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPleinsByCamion = async (req, res) => {
    try {
        const pleins = await pleinCarburantService.getPleinsByCamion(req.params.camionId);
        res.status(200).json(pleins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPleinById = async (req, res) => {
    try {
        const plein = await pleinCarburantService.getPleinById(req.params.id);
        res.status(200).json(plein);
    } catch (error) {
        if (error.message === 'Plein non trouvé') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.updatePlein = async (req, res) => {
    try {
        const plein = await pleinCarburantService.updatePlein(req.params.id, req.body);
        res.status(200).json(plein);
    } catch (error) {
        if (error.message === 'Plein non trouvé') {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};

exports.deletePlein = async (req, res) => {
    try {
        await pleinCarburantService.deletePlein(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Plein non trouvé') {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};

exports.getRapports = async (req, res) => {
    try {
        const rapports = await pleinCarburantService.getRapports();
        res.status(200).json(rapports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOptimisation = async (req, res) => {
    try {
        const optimisation = await pleinCarburantService.getOptimisationCouts();
        res.status(200).json(optimisation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
