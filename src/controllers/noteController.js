const noteModel = require("../models/noteModel");
const shareModel = require("../models/shareModel");
const {
  isOwner,
  isAdmin,
  canView,
  canEdit,
  canManage,
} = require("../policies/notePolicy");

async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = await noteModel.createNote({
      title,
      content,
      ownerId: req.user.id,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMyNotes(req, res) {
  try {
    const notes = await noteModel.getNotesByOwner(req.user.id);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getVisibleNotes(req, res) {
  try {
    const notes = isAdmin(req.user)
      ? await noteModel.getAllNotes()
      : await noteModel.getVisibleNotes(req.user.id);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getNote(req, res) {
  try {
    const note = await noteModel.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    const share = isOwner(req.user, note)
      ? null
      : await shareModel.getShare(note.id, req.user.id);
    if (!canView(req.user, note, share)) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this note" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateNote(req, res) {
  try {
    const note = await noteModel.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    const share = isOwner(req.user, note)
      ? null
      : await shareModel.getShare(note.id, req.user.id);
    if (!canEdit(req.user, note, share)) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this note" });
    }
    const { title, content } = req.body;
    const updated = await noteModel.updateNote(req.params.id, {
      title,
      content,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteNote(req, res) {
  try {
    const note = await noteModel.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    if (!canManage(req.user, note)) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this note" });
    }
    await noteModel.deleteNote(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateNoteVisibility(req, res) {
  try {
    const note = await noteModel.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    if (!canManage(req.user, note)) {
      return res
        .status(403)
        .json({ error: "Not authorized to change visibility" });
    }
    const { visibility } = req.body;
    if (visibility !== "private" && visibility !== "public") {
      return res
        .status(400)
        .json({ error: "Visibility must be 'private' or 'public'" });
    }
    const updated = await noteModel.updateVisibility(req.params.id, visibility);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createNote,
  getMyNotes,
  getVisibleNotes,
  getNote,
  updateNote,
  deleteNote,
  updateNoteVisibility,
};
