const express = require('express');
const router  = express.Router();

const {
  listarTodas, buscarPorId, criar, atualizar, apagar,
} = require('../controllers/reservas.controller');

const { authMiddleware } = require('../middleware/auth.middleware');
const {
  validarCriarReserva, validarAtualizarReserva,
} = require('../middleware/validation.middleware');

// Todas as rotas exigem autenticação
router.use(authMiddleware);

router.get('/',    listarTodas);
router.get('/:id', buscarPorId);
router.post('/',   validarCriarReserva,    criar);
router.put('/:id', validarAtualizarReserva, atualizar);
router.delete('/:id', apagar);

module.exports = router;
