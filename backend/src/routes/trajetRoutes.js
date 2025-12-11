const express = require('express');
const router = express.Router();
const trajetController = require('../controllers/trajetController');
const { validateTrajet } = require('../validators/trajetValidator');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');

router.post('/', authenticate, authorize([RoleUtilisateur.ADMIN]), validateTrajet, trajetController.createTrajet);
router.get('/', authenticate, trajetController.getAllTrajets);
router.get('/chauffeur/:id', authenticate, trajetController.getTrajetByChauffeurId);
router.get('/statut/:statut', authenticate, trajetController.getTrajetByStatut);
router.get('/:id', authenticate, trajetController.getTrajetById);
router.patch('/:id/statut', authenticate, trajetController.updateStatut);
router.put('/:id', authenticate, trajetController.updateTrajet);
router.get('/:id/pdf', authenticate, trajetController.generatePdf);
router.delete('/:id', authenticate, trajetController.deleteTrajet);

module.exports = router;
