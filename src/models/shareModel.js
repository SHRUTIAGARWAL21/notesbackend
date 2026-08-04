const pool = require("../config/db");

async function createShare(noteId, userId, permission = "editor") {
  const result = await pool.query(
    `INSERT INTO shares (note_id, user_id, permission)
     VALUES ($1, $2, $3)
     ON CONFLICT (note_id, user_id) DO UPDATE SET permission = EXCLUDED.permission
     RETURNING *`,
    [noteId, userId, permission],
  );
  return result.rows[0];
}

async function deleteShare(noteId, userId) {
  await pool.query(`DELETE FROM shares WHERE note_id = $1 AND user_id = $2`, [
    noteId,
    userId,
  ]);
}

async function getShare(noteId, userId) {
  const result = await pool.query(
    `SELECT * FROM shares WHERE note_id = $1 AND user_id = $2`,
    [noteId, userId],
  );
  return result.rows[0];
}

module.exports = { createShare, deleteShare, getShare };
