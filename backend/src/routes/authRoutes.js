const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const RoleUtilisateur = require('../enums/roles');

const {
  validateRegister,
  validateLogin,
} = require('../validators/authValidator');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get(
  '/users',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  authController.getAllUsers
);
router.get(
  '/chauffeurs',
  authenticate,
  authorize([RoleUtilisateur.ADMIN]),
  authController.getChauffeurs
);

module.exports = router;
