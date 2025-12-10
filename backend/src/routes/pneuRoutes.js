const express = require('express');
const router = express.Router();
const pneuController = require('../controllers/pneuController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');

router.post('/', authenticate, authorize([RoleUtilisateur.ADMIN]), pneuController.createPneu);
router.get('/', authenticate, authorize([RoleUtilisateur.ADMIN]),pneuController.getAllPneus);
router.get('/position/:position', authenticate, authorize([RoleUtilisateur.ADMIN]),pneuController.getPneuByPosition);
router.get('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]),pneuController.getPneuById);
router.put('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), pneuController.updatePneu);
router.delete('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), pneuController.deletePneu);

module.exports = router;
