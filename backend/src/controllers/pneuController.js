const pneuService = require('../services/pneuService');

exports.createPneu = async (req, res) => {
    try {
        const pneu = await pneuService.createPneu(req.body);
        res.status(201).json(pneu);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllPneus = async (req, res) => {
    try {
        const pneus = await pneuService.getAllPneus();
        res.status(200).json(pneus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPneuByPosition = async (req, res) => {
    try {
        const pneus = await pneuService.getPneuByPosition(req.params.position);
        res.status(200).json(pneus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPneuById = async (req, res) => {
    try {
        const pneu = await pneuService.getPneuById(req.params.id);
        res.status(200).json(pneu);
    } catch (error) {
        if (error.message === 'Pneu non trouvé') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.updatePneu = async (req, res) => {
    try {
        const pneu = await pneuService.updatePneu(req.params.id, req.body);
        res.status(200).json(pneu);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePneu = async (req, res) => {
    try {
        await pneuService.deletePneu(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
