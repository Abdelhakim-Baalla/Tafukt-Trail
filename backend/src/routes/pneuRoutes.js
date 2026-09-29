const express = require('express');
const router = express.Router();
const pneuController = require('../controllers/pneuController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');
const { validatePneu, validatePneuUpdate } = require('../validators/pneuValidator');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, authorize([RoleUtilisateur.ADMIN]), validatePneu, pneuController.createPneu);
router.get('/', authenticate, authorize([RoleUtilisateur.ADMIN]), pneuController.getAllPneus);
router.get('/position/:position', authenticate, authorize([RoleUtilisateur.ADMIN]), pneuController.getPneuByPosition);
router.get('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), validateObjectId, pneuController.getPneuById);
router.put('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), validateObjectId, validatePneuUpdate, pneuController.updatePneu);
router.delete('/:id', authenticate, authorize([RoleUtilisateur.ADMIN]), validateObjectId, pneuController.deletePneu);

module.exports = router;
