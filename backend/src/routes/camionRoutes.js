const express = require('express');
const router = express.Router();
const camionController = require('../controllers/camionController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');

// Create Camion (Admin only)
router.post('/', authenticate, authorize([RoleUtilisateur.ADMIN]), camionController.createCamion);
router.get('/', authenticate, authorize([RoleUtilisateur.ADMIN]), camionController.getAllCamions);
router.get('/statut/:statut', authenticate, authorize([RoleUtilisateur.ADMIN]), camionController.getCamionByStatut);
router.get('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), camionController.getCamionById);
router.put('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), camionController.updateCamion);
router.delete('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), camionController.deleteCamion);

module.exports = router;
