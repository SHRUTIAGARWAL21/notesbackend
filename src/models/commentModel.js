const pool = require("../config/db");

async function createComment({ noteId, userId, content }) {
  const result = await pool.query(
    `INSERT INTO comments (note_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [noteId, userId, content],
  );
  return result.rows[0];
}

async function getCommentsByNote(noteId) {
  const result = await pool.query(
    `SELECT * FROM comments WHERE note_id = $1 ORDER BY created_at ASC`,
    [noteId],
  );
  return result.rows;
}

async function getCommentById(id) {
  const result = await pool.query(`SELECT * FROM comments WHERE id = $1`, [id]);
  return result.rows[0];
}

async function deleteComment(id) {
  await pool.query(`DELETE FROM comments WHERE id = $1`, [id]);
}

module.exports = {
  createComment,
  getCommentsByNote,
  getCommentById,
  deleteComment,
};
