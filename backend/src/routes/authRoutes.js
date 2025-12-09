const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { validateRegister, validateLogin } = require('../validators/authValidator');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

module.exports = router;
