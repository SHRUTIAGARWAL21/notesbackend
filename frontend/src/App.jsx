import { useState } from "react";
import Auth from "./components/Auth";
import NotesList from "./components/NotesList";
import NoteDetail from "./components/NoteDetail";
import { decodeToken } from "./api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const user = token ? decodeToken(token) : null;

  function handleLogin(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    setSelectedNoteId(null);
  }

  if (!token || !user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Notes</h1>
        <div className="header-right">
          <span>
            User #{user.id} ({user.role})
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {selectedNoteId ? (
        <NoteDetail
          token={token}
          user={user}
          noteId={selectedNoteId}
          onBack={() => setSelectedNoteId(null)}
        />
      ) : (
        <NotesList token={token} onOpenNote={setSelectedNoteId} />
      )}
    </div>
  );
}

export default App;
