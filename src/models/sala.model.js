const db = require('../config/db');

const SalaModel = {

  // Listar todas
  async listarTodas() {
    const result = await db.query('SELECT * FROM salas ORDER BY id');
    return result.rows;
  },

  // Buscar por ID
  async buscarPorId(id) {
    const result = await db.query('SELECT * FROM salas WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Criar
  async criar({ nome, capacidade, localizacao, descricao }) {
    const result = await db.query(
      `INSERT INTO salas (nome, capacidade, localizacao, descricao)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nome, capacidade, localizacao, descricao || null]
    );
    return result.rows[0];
  },

  // Atualizar
  async atualizar(id, campos) {
    const sets    = [];
    const valores = [];
    let i = 1;

    if (campos.nome)        { sets.push(`nome = $${i++}`);        valores.push(campos.nome); }
    if (campos.capacidade)  { sets.push(`capacidade = $${i++}`);  valores.push(campos.capacidade); }
    if (campos.localizacao) { sets.push(`localizacao = $${i++}`); valores.push(campos.localizacao); }
    if (campos.descricao !== undefined) {
      sets.push(`descricao = $${i++}`);
      valores.push(campos.descricao);
    }

    if (sets.length === 0) return null;

    valores.push(id);
    const result = await db.query(
      `UPDATE salas SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
      valores
    );
    return result.rows[0];
  },

  // Apagar
  async apagar(id) {
    const result = await db.query(
      'DELETE FROM salas WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = SalaModel;
