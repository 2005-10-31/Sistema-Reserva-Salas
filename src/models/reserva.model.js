const db = require('../config/db');

const ReservaModel = {

  // Listar todas (com JOIN para mostrar nomes)
  async listarTodas() {
    const result = await db.query(`
      SELECT
        r.id,
        r.id_usuario,
        u.nome  AS usuario_nome,
        r.id_sala,
        s.nome  AS sala_nome,
        r.data_inicio,
        r.data_fim,
        r.descricao,
        r.status,
        r.created_at
      FROM reservas r
      JOIN usuarios u ON u.id = r.id_usuario
      JOIN salas    s ON s.id = r.id_sala
      ORDER BY r.data_inicio
    `);
    return result.rows;
  },

  // Buscar por ID
  async buscarPorId(id) {
    const result = await db.query(`
      SELECT
        r.id,
        r.id_usuario,
        u.nome  AS usuario_nome,
        r.id_sala,
        s.nome  AS sala_nome,
        r.data_inicio,
        r.data_fim,
        r.descricao,
        r.status,
        r.created_at
      FROM reservas r
      JOIN usuarios u ON u.id = r.id_usuario
      JOIN salas    s ON s.id = r.id_sala
      WHERE r.id = $1
    `, [id]);
    return result.rows[0];
  },

  // Verificar conflito de horário
  async verificarConflito(id_sala, data_inicio, data_fim, excluirId = null) {
    let query = `
      SELECT id FROM reservas
      WHERE id_sala = $1
        AND status  = 'ativa'
        AND data_inicio < $3
        AND data_fim    > $2
    `;
    const valores = [id_sala, data_inicio, data_fim];

    if (excluirId) {
      query += ` AND id != $4`;
      valores.push(excluirId);
    }

    const result = await db.query(query, valores);
    return result.rows.length > 0;
  },

  // Criar
  async criar({ id_usuario, id_sala, data_inicio, data_fim, descricao }) {
    const result = await db.query(
      `INSERT INTO reservas (id_usuario, id_sala, data_inicio, data_fim, descricao)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_usuario, id_sala, data_inicio, data_fim, descricao || null]
    );
    return result.rows[0];
  },

  // Atualizar
  async atualizar(id, campos) {
    const sets    = [];
    const valores = [];
    let i = 1;

    if (campos.id_sala)     { sets.push(`id_sala = $${i++}`);     valores.push(campos.id_sala); }
    if (campos.data_inicio) { sets.push(`data_inicio = $${i++}`); valores.push(campos.data_inicio); }
    if (campos.data_fim)    { sets.push(`data_fim = $${i++}`);    valores.push(campos.data_fim); }
    if (campos.descricao !== undefined) {
      sets.push(`descricao = $${i++}`);
      valores.push(campos.descricao);
    }
    if (campos.status) { sets.push(`status = $${i++}`); valores.push(campos.status); }

    if (sets.length === 0) return null;

    valores.push(id);
    const result = await db.query(
      `UPDATE reservas SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
      valores
    );
    return result.rows[0];
  },

  // Apagar
  async apagar(id) {
    const result = await db.query(
      'DELETE FROM reservas WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = ReservaModel;
