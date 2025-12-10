const trajetService = require('../services/trajetService');

exports.createTrajet = async (req, res) => {
    try {
        const trajet = await trajetService.createTrajet(req.body);
        res.status(201).json(trajet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllTrajets = async (req, res) => {
    try {
        const trajets = await trajetService.getAllTrajets(req.user);
        res.status(200).json(trajets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTrajetById = async (req, res) => {
    try {
        const trajet = await trajetService.getTrajetById(req.params.id);
        res.status(200).json(trajet);
    } catch (error) {
        if (error.message === 'Trajet non trouvé') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.updateStatut = async (req, res) => {
    try {
        const trajet = await trajetService.updateStatut(req.params.id, req.body, req.user);
        res.status(200).json(trajet);
    } catch (error) {
        if (error.message === 'Trajet non trouvé') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Accès non autorisé') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.updateTrajet = async (req, res) => {
    try {
        const trajet = await trajetService.updateTrajet(req.params.id, req.body, req.user);
        res.status(200).json(trajet);
    } catch (error) {
        if (error.message === 'Trajet non trouvé') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Accès non autorisé') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTrajet = async (req, res) => {
    try {
        await trajetService.deleteTrajet(req.params.id, req.user);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Trajet non trouvé') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Accès non autorisé') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};
