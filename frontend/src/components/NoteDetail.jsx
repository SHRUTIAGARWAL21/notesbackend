import { useState, useEffect } from "react";
import {
  getNote,
  updateNote,
  deleteNote,
  updateVisibility,
  shareNote,
  revokeShare,
  getComments,
  addComment,
  deleteComment,
} from "../api";

function NoteDetail({ token, user, noteId, onBack }) {
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [shareUserId, setShareUserId] = useState("");
  const [revokeUserId, setRevokeUserId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const n = await getNote(token, noteId);
      setNote(n);
      setTitle(n.title);
      setContent(n.content || "");
      const c = await getComments(token, noteId);
      setComments(c);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [noteId]);

  const isOwner = note && user.id === note.owner_id;

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    try {
      const updated = await updateNote(token, noteId, title, content);
      setNote(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    setError("");
    try {
      await deleteNote(token, noteId);
      onBack();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleVisibilityToggle() {
    setError("");
    try {
      const next = note.visibility === "private" ? "public" : "private";
      const updated = await updateVisibility(token, noteId, next);
      setNote(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleShare(e) {
    e.preventDefault();
    setError("");
    try {
      await shareNote(token, noteId, shareUserId);
      setShareUserId("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRevoke(e) {
    e.preventDefault();
    setError("");
    try {
      await revokeShare(token, noteId, revokeUserId);
      setRevokeUserId("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    setError("");
    try {
      await addComment(token, noteId, newComment);
      setNewComment("");
      const c = await getComments(token, noteId);
      setComments(c);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteComment(commentId) {
    setError("");
    try {
      await deleteComment(token, noteId, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err.message);
    }
  }

  if (!note) {
    return (
      <div className="note-detail">
        <button onClick={onBack}>Back</button>
        {error ? <p className="error">{error}</p> : <p>Loading...</p>}
      </div>
    );
  }

  return (
    <div className="note-detail">
      <button onClick={onBack}>Back</button>

      <form onSubmit={handleSave} className="note-form">
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <div className="note-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={handleVisibilityToggle}>
            Make {note.visibility === "private" ? "Public" : "Private"}
          </button>
          {isOwner && (
            <button type="button" className="danger" onClick={handleDelete}>
              Delete Note
            </button>
          )}
        </div>
      </form>

      {isOwner && (
        <section className="share-section">
          <h3>Sharing</h3>
          <form onSubmit={handleShare}>
            <input
              type="number"
              placeholder="User ID to share with (editor access)"
              value={shareUserId}
              onChange={(e) => setShareUserId(e.target.value)}
              required
            />
            <button type="submit">Share</button>
          </form>
          <form onSubmit={handleRevoke}>
            <input
              type="number"
              placeholder="User ID to revoke"
              value={revokeUserId}
              onChange={(e) => setRevokeUserId(e.target.value)}
              required
            />
            <button type="submit">Revoke</button>
          </form>
        </section>
      )}

      <section className="comments-section">
        <h3>Comments</h3>
        <form onSubmit={handleAddComment}>
          <input
            type="text"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button type="submit">Post</button>
        </form>
        <ul className="comments-list">
          {comments.map((c) => (
            <li key={c.id}>
              <span>{c.content}</span>
              {(c.user_id === user.id || isOwner) && (
                <button onClick={() => handleDeleteComment(c.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default NoteDetail;
