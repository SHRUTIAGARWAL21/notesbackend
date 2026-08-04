import { useState, useEffect } from "react";
import { getMyNotes, createNote } from "../api";

function NotesList({ token, onOpenNote }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function loadNotes() {
    try {
      const data = await getMyNotes(token);
      setNotes(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await createNote(token, title, content);
      setTitle("");
      setContent("");
      loadNotes();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="notes-list">
      <form onSubmit={handleCreate} className="create-note-form">
        <h2>New Note</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Create Note</button>
        {error && <p className="error">{error}</p>}
      </form>

      <h2>My Notes</h2>
      {notes.length === 0 && <p>No notes yet.</p>}
      <ul className="notes-grid">
        {notes.map((note) => (
          <li key={note.id} className="note-card" onClick={() => onOpenNote(note.id)}>
            <h3>{note.title}</h3>
            <p className="note-visibility">{note.visibility}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotesList;
