const SalaModel = require('../models/sala.model');

// GET /api/salas
const listarTodas = async (req, res, next) => {
  try {
    const salas = await SalaModel.listarTodas();
    res.json(salas);
  } catch (err) {
    next(err);
  }
};

// GET /api/salas/:id
const buscarPorId = async (req, res, next) => {
  try {
    const sala = await SalaModel.buscarPorId(req.params.id);
    if (!sala) {
      return res.status(404).json({ mensagem: 'Sala não encontrada.' });
    }
    res.json(sala);
  } catch (err) {
    next(err);
  }
};

// POST /api/salas
const criar = async (req, res, next) => {
  try {
    const { nome, capacidade, localizacao, descricao } = req.body;
    const sala = await SalaModel.criar({ nome, capacidade, localizacao, descricao });
    res.status(201).json({ mensagem: 'Sala criada com sucesso.', sala });
  } catch (err) {
    // Erro de nome duplicado (UNIQUE constraint)
    if (err.code === '23505') {
      return res.status(409).json({ mensagem: 'Já existe uma sala com esse nome.' });
    }
    next(err);
  }
};

// PUT /api/salas/:id
const atualizar = async (req, res, next) => {
  try {
    const { nome, capacidade, localizacao, descricao } = req.body;
    const sala = await SalaModel.atualizar(req.params.id, { nome, capacidade, localizacao, descricao });
    if (!sala) {
      return res.status(404).json({ mensagem: 'Sala não encontrada.' });
    }
    res.json({ mensagem: 'Sala atualizada.', sala });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ mensagem: 'Já existe uma sala com esse nome.' });
    }
    next(err);
  }
};

// DELETE /api/salas/:id
const apagar = async (req, res, next) => {
  try {
    const removida = await SalaModel.apagar(req.params.id);
    if (!removida) {
      return res.status(404).json({ mensagem: 'Sala não encontrada.' });
    }
    res.json({ mensagem: 'Sala removida com sucesso.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listarTodas, buscarPorId, criar, atualizar, apagar };
