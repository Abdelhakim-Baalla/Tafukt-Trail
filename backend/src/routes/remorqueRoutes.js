const express = require('express');
const router = express.Router();
const remorqueController = require('../controllers/remorqueController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');

router.post('/', authenticate, authorize([RoleUtilisateur.ADMIN]), remorqueController.createRemorque);
router.get('/', authenticate, authorize([RoleUtilisateur.ADMIN]), remorqueController.getAllRemorques);
router.get('/statut/:statut', authenticate, authorize([RoleUtilisateur.ADMIN]), remorqueController.getRemorqueByStatut);
router.get('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), remorqueController.getRemorqueById);
router.put('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), remorqueController.updateRemorque);
router.delete('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), remorqueController.deleteRemorque);

module.exports = router;
