const express = require('express');
const router  = express.Router();

const {
  listarTodas, buscarPorId, criar, atualizar, apagar,
} = require('../controllers/salas.controller');

const { authMiddleware, apenasAdmin } = require('../middleware/auth.middleware');
const {
  validarCriarSala, validarAtualizarSala,
} = require('../middleware/validation.middleware');

// Listar e ver detalhes: qualquer utilizador autenticado
router.get('/',    authMiddleware, listarTodas);
router.get('/:id', authMiddleware, buscarPorId);

// Criar, editar, apagar: apenas admin
router.post('/',   authMiddleware, apenasAdmin, validarCriarSala, criar);
router.put('/:id', authMiddleware, apenasAdmin, validarAtualizarSala, atualizar);
router.delete('/:id', authMiddleware, apenasAdmin, apagar);

module.exports = router;
