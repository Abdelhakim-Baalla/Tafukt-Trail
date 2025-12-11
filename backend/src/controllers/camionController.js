const camionService = require('../services/camionService');

exports.createCamion = async (req, res) => {
    try {
        const camion = await camionService.createCamion(req.body);
        res.status(201).json(camion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllCamions = async (req, res) => {
    try {
        const camions = await camionService.getAllCamions();
        res.status(200).json(camions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCamionByStatut = async (req, res) => {
    try {
        const camions = await camionService.getCamionByStatut(req.params.statut);
        res.status(200).json(camions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCamionById = async (req, res) => {
    try {
        const camion = await camionService.getCamionById(req.params.id);
        res.status(200).json(camion);
    } catch (error) {
        if (error.message === 'Camion non trouvé') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.updateCamion = async (req, res) => {
    try {
        const camion = await camionService.updateCamion(req.params.id, req.body);
        res.status(200).json(camion);
    } catch (error) {
        if (error.message === 'Camion non trouvé') {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCamion = async (req, res) => {
    try {
        await camionService.deleteCamion(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Camion non trouvé') {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};
