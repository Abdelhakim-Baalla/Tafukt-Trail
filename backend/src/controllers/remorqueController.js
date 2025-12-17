const remorqueService = require('../services/remorqueService');

exports.createRemorque = async (req, res) => {
    try {
        const remorque = await remorqueService.createRemorque(req.body);
        res.status(201).json(remorque);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllRemorques = async (req, res) => {
    try {
        const remorques = await remorqueService.getAllRemorques();
        res.status(200).json(remorques);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRemorqueByStatut = async (req, res) => {
    try {
        const remorques = await remorqueService.getRemorqueByStatut(req.params.statut);
        res.status(200).json(remorques);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRemorqueById = async (req, res) => {
    try {
        const remorque = await remorqueService.getRemorqueById(req.params.id);
        res.status(200).json(remorque);
    } catch (error) {
        if (error.message === 'Remorque non trouvée') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.updateRemorque = async (req, res) => {
    try {
        const remorque = await remorqueService.updateRemorque(req.params.id, req.body);
        res.status(200).json(remorque);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteRemorque = async (req, res) => {
    try {
        await remorqueService.deleteRemorque(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
