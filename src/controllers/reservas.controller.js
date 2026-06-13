const ReservaModel = require('../models/reserva.model');

// GET /api/reservas
const listarTodas = async (req, res, next) => {
  try {
    const reservas = await ReservaModel.listarTodas();
    res.json(reservas);
  } catch (err) {
    next(err);
  }
};

// GET /api/reservas/:id
const buscarPorId = async (req, res, next) => {
  try {
    const reserva = await ReservaModel.buscarPorId(req.params.id);
    if (!reserva) {
      return res.status(404).json({ mensagem: 'Reserva não encontrada.' });
    }
    res.json(reserva);
  } catch (err) {
    next(err);
  }
};

// POST /api/reservas
const criar = async (req, res, next) => {
  try {
    const { id_sala, data_inicio, data_fim, descricao } = req.body;
    const id_usuario = req.usuario.id; // vem do token JWT

    // Verificar conflito de horário
    const conflito = await ReservaModel.verificarConflito(id_sala, data_inicio, data_fim);
    if (conflito) {
      return res.status(409).json({
        mensagem: 'A sala já está reservada nesse período. Escolha outro horário.',
      });
    }

    const reserva = await ReservaModel.criar({ id_usuario, id_sala, data_inicio, data_fim, descricao });
    res.status(201).json({ mensagem: 'Reserva criada com sucesso.', reserva });
  } catch (err) {
    next(err);
  }
};

// PUT /api/reservas/:id
const atualizar = async (req, res, next) => {
  try {
    const { id_sala, data_inicio, data_fim, descricao, status } = req.body;

    // Verificar se a reserva existe
    const reservaExistente = await ReservaModel.buscarPorId(req.params.id);
    if (!reservaExistente) {
      return res.status(404).json({ mensagem: 'Reserva não encontrada.' });
    }

    // Apenas o dono ou admin pode alterar
    if (reservaExistente.id_usuario !== req.usuario.id && req.usuario.role !== 'admin') {
      return res.status(403).json({ mensagem: 'Sem permissão para alterar esta reserva.' });
    }

    // Verificar conflito se mudar horário
    if (data_inicio && data_fim) {
      const salaId = id_sala || reservaExistente.id_sala;
      const conflito = await ReservaModel.verificarConflito(
        salaId, data_inicio, data_fim, req.params.id
      );
      if (conflito) {
        return res.status(409).json({
          mensagem: 'A sala já está reservada nesse período. Escolha outro horário.',
        });
      }
    }

    const reserva = await ReservaModel.atualizar(req.params.id, {
      id_sala, data_inicio, data_fim, descricao, status,
    });

    res.json({ mensagem: 'Reserva atualizada.', reserva });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/reservas/:id
const apagar = async (req, res, next) => {
  try {
    const reservaExistente = await ReservaModel.buscarPorId(req.params.id);
    if (!reservaExistente) {
      return res.status(404).json({ mensagem: 'Reserva não encontrada.' });
    }

    // Apenas o dono ou admin pode apagar
    if (reservaExistente.id_usuario !== req.usuario.id && req.usuario.role !== 'admin') {
      return res.status(403).json({ mensagem: 'Sem permissão para apagar esta reserva.' });
    }

    await ReservaModel.apagar(req.params.id);
    res.json({ mensagem: 'Reserva apagada com sucesso.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listarTodas, buscarPorId, criar, atualizar, apagar };
