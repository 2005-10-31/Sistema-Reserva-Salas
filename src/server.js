require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const authRoutes     = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const salasRoutes    = require('./routes/salas.routes');
const reservasRoutes = require('./routes/reservas.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globais ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ mensagem: '🚀 API Reservas de Salas funcionando!' });
});

app.use('/api/auth',     authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/salas',    salasRoutes);
app.use('/api/reservas', reservasRoutes);

// ── Rota não encontrada ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

// ── Middleware de tratamento de erros centralizado ────────────────────────────
// Deve vir DEPOIS de todas as rotas, com 4 parâmetros (err, req, res, next)
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.message);
  console.error(err.stack);

  const status = err.status || 500;
  res.status(status).json({
    mensagem: err.message || 'Erro interno do servidor.',
  });
});

// ── Iniciar servidor ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor a correr em http://localhost:${PORT}`);
});
