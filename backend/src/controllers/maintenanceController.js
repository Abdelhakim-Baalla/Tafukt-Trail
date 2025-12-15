const maintenanceService = require('../services/maintenanceService');

// ==================== INTERVENTIONS ====================

exports.getAllInterventions = async (req, res) => {
  try {
    const interventions = await maintenanceService.getAllInterventions();
    res.json(interventions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInterventionById = async (req, res) => {
  try {
    const intervention = await maintenanceService.getInterventionById(
      req.params.id
    );
    if (!intervention) {
      return res.status(404).json({ message: 'Intervention non trouvée' });
    }
    res.json(intervention);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInterventionsByCamion = async (req, res) => {
  try {
    const interventions = await maintenanceService.getInterventionsByCamion(
      req.params.camionId
    );
    res.json(interventions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createIntervention = async (req, res) => {
  try {
    const intervention = await maintenanceService.createIntervention(req.body);
    res.status(201).json(intervention);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateIntervention = async (req, res) => {
  try {
    const intervention = await maintenanceService.updateIntervention(
      req.params.id,
      req.body
    );
    if (!intervention) {
      return res.status(404).json({ message: 'Intervention non trouvée' });
    }
    res.json(intervention);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteIntervention = async (req, res) => {
  try {
    const intervention = await maintenanceService.deleteIntervention(
      req.params.id
    );
    if (!intervention) {
      return res.status(404).json({ message: 'Intervention non trouvée' });
    }
    res.json({ message: 'Intervention supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== REGLES ====================

exports.getAllRegles = async (req, res) => {
  try {
    const regles = await maintenanceService.getAllRegles();
    res.json(regles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRegleById = async (req, res) => {
  try {
    const regle = await maintenanceService.getRegleById(req.params.id);
    if (!regle) {
      return res.status(404).json({ message: 'Règle non trouvée' });
    }
    res.json(regle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRegle = async (req, res) => {
  try {
    const regle = await maintenanceService.createRegle(req.body);
    res.status(201).json(regle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateRegle = async (req, res) => {
  try {
    const regle = await maintenanceService.updateRegle(req.params.id, req.body);
    if (!regle) {
      return res.status(404).json({ message: 'Règle non trouvée' });
    }
    res.json(regle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRegle = async (req, res) => {
  try {
    const regle = await maintenanceService.deleteRegle(req.params.id);
    if (!regle) {
      return res.status(404).json({ message: 'Règle non trouvée' });
    }
    res.json({ message: 'Règle supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== ALERTES ====================

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
