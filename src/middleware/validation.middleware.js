// ── Usuários ─────────────────────────────────────────────────────────────────

const validarCriarUsuario = (req, res, next) => {
  const { nome, email, password, role } = req.body;

  if (!nome || !email || !password) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios: nome, email, password.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ mensagem: 'Email inválido.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ mensagem: 'Password deve ter pelo menos 6 caracteres.' });
  }

  const rolesValidas = ['admin', 'user'];
  if (role && !rolesValidas.includes(role)) {
    return res.status(400).json({ mensagem: `Role inválida. Use: ${rolesValidas.join(', ')}.` });
  }

  next();
};

const validarAtualizarUsuario = (req, res, next) => {
  const { email, password, role } = req.body;

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ mensagem: 'Email inválido.' });
    }
  }

  if (password && password.length < 6) {
    return res.status(400).json({ mensagem: 'Password deve ter pelo menos 6 caracteres.' });
  }

  const rolesValidas = ['admin', 'user'];
  if (role && !rolesValidas.includes(role)) {
    return res.status(400).json({ mensagem: `Role inválida. Use: ${rolesValidas.join(', ')}.` });
  }

  next();
};

// ── Salas ─────────────────────────────────────────────────────────────────────

const validarCriarSala = (req, res, next) => {
  const { nome, capacidade, localizacao } = req.body;

  if (!nome || !capacidade || !localizacao) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios: nome, capacidade, localizacao.' });
  }

  if (isNaN(capacidade) || Number(capacidade) <= 0) {
    return res.status(400).json({ mensagem: 'Capacidade deve ser um número maior que 0.' });
  }

  next();
};

const validarAtualizarSala = (req, res, next) => {
  const { capacidade } = req.body;

  if (capacidade !== undefined && (isNaN(capacidade) || Number(capacidade) <= 0)) {
    return res.status(400).json({ mensagem: 'Capacidade deve ser um número maior que 0.' });
  }

  next();
};

// ── Reservas ──────────────────────────────────────────────────────────────────

const validarCriarReserva = (req, res, next) => {
  const { id_sala, data_inicio, data_fim } = req.body;

  if (!id_sala || !data_inicio || !data_fim) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios: id_sala, data_inicio, data_fim.' });
  }

  const inicio = new Date(data_inicio);
  const fim    = new Date(data_fim);

  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
    return res.status(400).json({ mensagem: 'Datas inválidas. Use o formato: YYYY-MM-DD HH:MM:SS' });
  }

  if (fim <= inicio) {
    return res.status(400).json({ mensagem: 'data_fim deve ser posterior a data_inicio.' });
  }

  if (inicio < new Date()) {
    return res.status(400).json({ mensagem: 'Não é possível reservar para uma data no passado.' });
  }

  next();
};

const validarAtualizarReserva = (req, res, next) => {
  const { data_inicio, data_fim, status } = req.body;

  if (data_inicio && data_fim) {
    const inicio = new Date(data_inicio);
    const fim    = new Date(data_fim);

    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      return res.status(400).json({ mensagem: 'Datas inválidas.' });
    }

    if (fim <= inicio) {
      return res.status(400).json({ mensagem: 'data_fim deve ser posterior a data_inicio.' });
    }
  }

  const statusValidos = ['ativa', 'cancelada', 'concluida'];
  if (status && !statusValidos.includes(status)) {
    return res.status(400).json({ mensagem: `Status inválido. Use: ${statusValidos.join(', ')}.` });
  }

  next();
};

// ── Auth ──────────────────────────────────────────────────────────────────────

const validarLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios: email, password.' });
  }

  next();
};

module.exports = {
  validarCriarUsuario,
  validarAtualizarUsuario,
  validarCriarSala,
  validarAtualizarSala,
  validarCriarReserva,
  validarAtualizarReserva,
  validarLogin,
};
