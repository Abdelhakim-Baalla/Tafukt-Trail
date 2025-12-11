const express = require('express');
const router = express.Router();
const pleinCarburantController = require('../controllers/pleinCarburantController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');
const { validatePleinCarburant, validatePleinCarburantUpdate } = require('../validators/pleinCarburantValidator');

// Chauffeur
router.post('/', authenticate, authorize([RoleUtilisateur.ADMIN, RoleUtilisateur.CHAUFFEUR]), validatePleinCarburant, pleinCarburantController.createPlein);

// Admin only
router.get('/', authenticate, authorize([RoleUtilisateur.ADMIN]), pleinCarburantController.getAllPleins);
router.get('/rapports', authenticate, authorize([RoleUtilisateur.ADMIN]), pleinCarburantController.getRapports);
router.get('/optimisation', authenticate, authorize([RoleUtilisateur.ADMIN]), pleinCarburantController.getOptimisation);
router.get('/camion/:camionId', authenticate, authorize([RoleUtilisateur.ADMIN]), pleinCarburantController.getPleinsByCamion);
router.get('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), pleinCarburantController.getPleinById);
router.put('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), validatePleinCarburantUpdate, pleinCarburantController.updatePlein);
router.delete('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), pleinCarburantController.deletePlein);

module.exports = router;

