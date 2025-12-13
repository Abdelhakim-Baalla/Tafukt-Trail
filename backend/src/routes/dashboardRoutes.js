const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');

router.get('/stats', authenticate, authorize([RoleUtilisateur.ADMIN]), dashboardController.getStats);

module.exports = router;