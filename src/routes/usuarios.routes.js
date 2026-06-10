const express = require('express');
const router  = express.Router();

const {
  listarTodos, buscarPorId, criar, atualizar, apagar,
} = require('../controllers/usuarios.controller');

const { authMiddleware, apenasAdmin } = require('../middleware/auth.middleware');
const {
  validarCriarUsuario, validarAtualizarUsuario,
} = require('../middleware/validation.middleware');

// Todas as rotas exigem autenticação
router.use(authMiddleware);

router.get('/',    apenasAdmin, listarTodos);
router.get('/:id',             buscarPorId);
router.post('/',   apenasAdmin, validarCriarUsuario, criar);
router.put('/:id',             validarAtualizarUsuario, atualizar);
router.delete('/:id', apenasAdmin, apagar);

module.exports = router;
