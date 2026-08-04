import { useState, useEffect } from "react";
import { getMyNotes, getVisibleNotes, createNote } from "../api";

function NotesList({ token, onOpenNote }) {
  const [notes, setNotes] = useState([]);
  const [scope, setScope] = useState("all");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function loadNotes(nextScope = scope) {
    try {
      const data = nextScope === "mine" ? await getMyNotes(token) : await getVisibleNotes(token);
      setNotes(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadNotes();
  }, [scope]);

  function handleScopeToggle() {
    setScope(scope === "all" ? "mine" : "all");
  }

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

      <div className="notes-list-header">
        <h2>{scope === "mine" ? "My Notes" : "All Notes"}</h2>
        <button type="button" onClick={handleScopeToggle}>
          {scope === "mine" ? "View All Notes" : "View My Notes"}
        </button>
      </div>
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
