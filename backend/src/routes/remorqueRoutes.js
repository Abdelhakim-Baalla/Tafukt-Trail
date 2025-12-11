const express = require('express');
const router = express.Router();
const remorqueController = require('../controllers/remorqueController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');
const { validateRemorque, validateRemorqueUpdate } = require('../validators/remorqueValidator');

router.post('/', authenticate, authorize([RoleUtilisateur.ADMIN]), validateRemorque, remorqueController.createRemorque);
router.get('/', authenticate, authorize([RoleUtilisateur.ADMIN]), remorqueController.getAllRemorques);
router.get('/statut/:statut', authenticate, authorize([RoleUtilisateur.ADMIN]), remorqueController.getRemorqueByStatut);
router.get('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), remorqueController.getRemorqueById);
router.put('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), validateRemorqueUpdate, remorqueController.updateRemorque);
router.delete('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), remorqueController.deleteRemorque);

module.exports = router;
