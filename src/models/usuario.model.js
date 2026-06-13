const db = require('../config/db');

const UsuarioModel = {

  // Listar todos
  async listarTodos() {
    const result = await db.query(
      'SELECT id, nome, email, role, created_at FROM usuarios ORDER BY id'
    );
    return result.rows;
  },

  // Buscar por ID
  async buscarPorId(id) {
    const result = await db.query(
      'SELECT id, nome, email, role, created_at FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Buscar por email (inclui password para autenticação)
  async buscarPorEmail(email) {
    const result = await db.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  // Criar
  async criar({ nome, email, password, role }) {
    const result = await db.query(
      `INSERT INTO usuarios (nome, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, role, created_at`,
      [nome, email, password, role || 'user']
    );
    return result.rows[0];
  },

  // Atualizar
  async atualizar(id, campos) {
    const sets   = [];
    const valores = [];
    let i = 1;

    if (campos.nome)     { sets.push(`nome = $${i++}`);     valores.push(campos.nome); }
    if (campos.email)    { sets.push(`email = $${i++}`);    valores.push(campos.email); }
    if (campos.password) { sets.push(`password = $${i++}`); valores.push(campos.password); }
    if (campos.role)     { sets.push(`role = $${i++}`);     valores.push(campos.role); }

    if (sets.length === 0) return null;

    valores.push(id);
    const result = await db.query(
      `UPDATE usuarios SET ${sets.join(', ')} WHERE id = $${i}
       RETURNING id, nome, email, role, created_at`,
      valores
    );
    return result.rows[0];
  },

  // Apagar
  async apagar(id) {
    const result = await db.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = UsuarioModel;
