const API_BASE = "http://localhost:3000/api";

async function apiFetch(path, { method = "GET", token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export const signup = (name, email, password) =>
  apiFetch("/auth/signup", { method: "POST", body: { name, email, password } });

export const login = (email, password) =>
  apiFetch("/auth/login", { method: "POST", body: { email, password } });

export const getMyNotes = (token) => apiFetch("/notes", { token });

export const getVisibleNotes = (token) => apiFetch("/notes/visible", { token });

export const getNote = (token, id) => apiFetch(`/notes/${id}`, { token });

export const createNote = (token, title, content) =>
  apiFetch("/notes", { method: "POST", token, body: { title, content } });

export const updateNote = (token, id, title, content) =>
  apiFetch(`/notes/${id}`, { method: "PUT", token, body: { title, content } });

export const deleteNote = (token, id) => apiFetch(`/notes/${id}`, { method: "DELETE", token });

export const updateVisibility = (token, id, visibility) =>
  apiFetch(`/notes/${id}/visibility`, { method: "PATCH", token, body: { visibility } });

export const shareNote = (token, id, userId) =>
  apiFetch(`/notes/${id}/shares`, { method: "POST", token, body: { userId } });

export const revokeShare = (token, id, userId) =>
  apiFetch(`/notes/${id}/shares/${userId}`, { method: "DELETE", token });

export const getComments = (token, id) => apiFetch(`/notes/${id}/comments`, { token });

export const addComment = (token, id, content) =>
  apiFetch(`/notes/${id}/comments`, { method: "POST", token, body: { content } });

export const deleteComment = (token, noteId, commentId) =>
  apiFetch(`/notes/${noteId}/comments/${commentId}`, { method: "DELETE", token });
