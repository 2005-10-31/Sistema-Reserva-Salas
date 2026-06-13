const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const UsuarioModel = require('../models/usuario.model');
require('dotenv').config();

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await UsuarioModel.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Email ou password incorretos.' });
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Email ou password incorretos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      mensagem: 'Login efetuado com sucesso.',
      token,
      usuario: {
        id:    usuario.id,
        nome:  usuario.nome,
        email: usuario.email,
        role:  usuario.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/registar
const registar = async (req, res, next) => {
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

module.exports = { login, registar };
