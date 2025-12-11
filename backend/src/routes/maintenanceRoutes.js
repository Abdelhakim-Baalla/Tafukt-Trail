const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');

router.get('/alertes', authenticate, authorize([RoleUtilisateur.ADMIN]), maintenanceController.getAlertesMaintenance);
router.post('/planifier', authenticate, authorize([RoleUtilisateur.ADMIN]), maintenanceController.planifierMaintenance);

module.exports = router;