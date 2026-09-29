const express = require('express');
const router = express.Router();
const trajetController = require('../controllers/trajetController');
const { validateTrajet } = require('../validators/trajetValidator');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');
const RoleUtilisateur = require('../enums/roles');

router.post('/', authenticate, authorize([RoleUtilisateur.ADMIN]), validateTrajet, trajetController.createTrajet);
router.get('/', authenticate, authorize([RoleUtilisateur.ADMIN, RoleUtilisateur.CHAUFFEUR]), trajetController.getAllTrajets);
router.get('/chauffeur/:id', authenticate, authorize([RoleUtilisateur.ADMIN, RoleUtilisateur.CHAUFFEUR]), validateObjectId, trajetController.getTrajetByChauffeurId);
router.get('/statut/:statut', authenticate, authorize([RoleUtilisateur.ADMIN, RoleUtilisateur.CHAUFFEUR]), trajetController.getTrajetByStatut);
router.get('/:id', authenticate, authorize([RoleUtilisateur.ADMIN, RoleUtilisateur.CHAUFFEUR]), validateObjectId, trajetController.getTrajetById);
router.patch('/:id/statut', authenticate, authorize([RoleUtilisateur.ADMIN, RoleUtilisateur.CHAUFFEUR]), validateObjectId, trajetController.updateStatut);
router.put('/:id', authenticate, authorize([RoleUtilisateur.ADMIN, RoleUtilisateur.CHAUFFEUR]), validateObjectId, trajetController.updateTrajet);
router.get('/:id/pdf', authenticate, authorize([RoleUtilisateur.ADMIN, RoleUtilisateur.CHAUFFEUR]), validateObjectId, trajetController.generatePdf);
router.delete('/:id', authenticate, authorize([RoleUtilisateur.ADMIN, RoleUtilisateur.CHAUFFEUR]), validateObjectId, trajetController.deleteTrajet);

module.exports = router;
