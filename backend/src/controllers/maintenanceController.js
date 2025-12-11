const maintenanceService = require('../services/maintenanceService');

exports.getAlertesMaintenance = async (req, res) => {
    try {
        const alertes = await maintenanceService.verifierMaintenancePreventive();
        res.json(alertes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.planifierMaintenance = async (req, res) => {
    try {
        const planning = await maintenanceService.planifierMaintenance(
            req.body.camionId, 
            req.body.typeIntervention, 
            req.body.datePrevu
        );
        res.json(planning);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};