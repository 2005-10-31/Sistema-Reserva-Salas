const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Verificar se o header existe
  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  // Verificar formato Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ mensagem: 'Formato do token inválido. Use: Bearer <token>' });
  }

  const token = parts[1];

  // Validar o token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // disponibiliza o payload nas rotas
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ mensagem: 'Token expirado. Faça login novamente.' });
    }
    return res.status(401).json({ mensagem: 'Token inválido.' });
  }
};

// Middleware para verificar se é admin
const apenasAdmin = (req, res, next) => {
  if (req.usuario.role !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

module.exports = { authMiddleware, apenasAdmin };
