const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');

// ==================== INTERVENTIONS ====================
router.get(
  '/interventions',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.getAllInterventions
);
router.get(
  '/interventions/:id',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.getInterventionById
);
router.get(
  '/interventions/camion/:camionId',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.getInterventionsByCamion
);
router.post(
  '/interventions',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.createIntervention
);
router.put(
  '/interventions/:id',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.updateIntervention
);
router.delete(
  '/interventions/:id',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.deleteIntervention
);

// ==================== REGLES ====================
router.get(
  '/regles',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.getAllRegles
);
router.get(
  '/regles/:id',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.getRegleById
);
router.post(
  '/regles',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.createRegle
);
router.put(
  '/regles/:id',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.updateRegle
);
router.delete(
  '/regles/:id',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.deleteRegle
);

// ==================== ALERTES ====================
router.get(
  '/alertes',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.getAlertesMaintenance
);
router.post(
  '/planifier',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  maintenanceController.planifierMaintenance
);

module.exports = router;
