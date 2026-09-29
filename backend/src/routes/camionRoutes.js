const express = require('express');
const router = express.Router();
const camionController = require('../controllers/camionController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');
const { validateCamion, validateCamionUpdate } = require('../validators/camionValidator');
const validateObjectId = require('../middlewares/validateObjectId');

// Create Camion (Admin only)
router.post('/', authenticate, authorize([RoleUtilisateur.ADMIN]), validateCamion, camionController.createCamion);
router.get('/', authenticate, authorize([RoleUtilisateur.ADMIN]), camionController.getAllCamions);
router.get('/statut/:statut', authenticate, authorize([RoleUtilisateur.ADMIN]), camionController.getCamionByStatut);
router.get('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), validateObjectId, camionController.getCamionById);
router.put('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), validateObjectId, validateCamionUpdate, camionController.updateCamion);
router.delete('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), validateObjectId, camionController.deleteCamion);

module.exports = router;
