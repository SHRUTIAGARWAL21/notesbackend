const pool = require("../config/db");

async function createNote({ title, content, ownerId }) {
  const result = await pool.query(
    `INSERT INTO notes (title, content, owner_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, content, ownerId],
  );
  return result.rows[0];
}

async function getNoteById(id) {
  const result = await pool.query(`SELECT * FROM notes WHERE id = $1`, [id]);
  return result.rows[0];
}

async function getNotesByOwner(ownerId) {
  const result = await pool.query(
    `SELECT * FROM notes WHERE owner_id = $1 ORDER BY created_at DESC`,
    [ownerId],
  );
  return result.rows;
}

async function updateNote(id, { title, content }) {
  const result = await pool.query(
    `UPDATE notes
     SET title = $1, content = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [title, content, id],
  );
  return result.rows[0];
}

async function deleteNote(id) {
  await pool.query(`DELETE FROM notes WHERE id = $1`, [id]);
}

async function updateVisibility(id, visibility) {
  const result = await pool.query(
    `UPDATE notes
     SET visibility = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [visibility, id],
  );
  return result.rows[0];
}

module.exports = {
  createNote,
  getNoteById,
  getNotesByOwner,
  updateNote,
  deleteNote,
  updateVisibility,
};
