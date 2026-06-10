const express = require('express');
const router  = express.Router();

const { login, registar }  = require('../controllers/auth.controller');
const { validarLogin, validarCriarUsuario } = require('../middleware/validation.middleware');

router.post('/login',   validarLogin,         login);
router.post('/registar', validarCriarUsuario, registar);

module.exports = router;
