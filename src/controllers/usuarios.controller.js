const bcrypt       = require('bcryptjs');
const UsuarioModel = require('../models/usuario.model');

// GET /api/usuarios
const listarTodos = async (req, res, next) => {
  try {
    const usuarios = await UsuarioModel.listarTodos();
    res.json(usuarios);
  } catch (err) {
    next(err);
  }
};

// GET /api/usuarios/:id
const buscarPorId = async (req, res, next) => {
  try {
    const usuario = await UsuarioModel.buscarPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Utilizador não encontrado.' });
    }
    res.json(usuario);
  } catch (err) {
    next(err);
  }
};

// POST /api/usuarios
const criar = async (req, res, next) => {
  try {
    const { nome, email, password, role } = req.body;

    const existe = await UsuarioModel.buscarPorEmail(email);
    if (existe) {
      return res.status(409).json({ mensagem: 'Email já registado.' });
    }

    const hash    = await bcrypt.hash(password, 10);
    const usuario = await UsuarioModel.criar({ nome, email, password: hash, role });

    res.status(201).json({ mensagem: 'Utilizador criado com sucesso.', usuario });
  } catch (err) {
    next(err);
  }
};

// PUT /api/usuarios/:id
const atualizar = async (req, res, next) => {
  try {
    const { nome, email, password, role } = req.body;

    // Apenas admin pode alterar o role
    if (role && req.usuario.role !== 'admin') {
      return res.status(403).json({ mensagem: 'Sem permissão para alterar o role.' });
    }

    const campos = { nome, email, role };
    if (password) campos.password = await bcrypt.hash(password, 10);

    const usuario = await UsuarioModel.atualizar(req.params.id, campos);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Utilizador não encontrado.' });
    }

    res.json({ mensagem: 'Utilizador atualizado.', usuario });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/usuarios/:id
const apagar = async (req, res, next) => {
  try {
    const removido = await UsuarioModel.apagar(req.params.id);
    if (!removido) {
      return res.status(404).json({ mensagem: 'Utilizador não encontrado.' });
    }
    res.json({ mensagem: 'Utilizador removido com sucesso.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listarTodos, buscarPorId, criar, atualizar, apagar };
