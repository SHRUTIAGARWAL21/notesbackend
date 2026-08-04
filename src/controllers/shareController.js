const noteModel = require("../models/noteModel");
const shareModel = require("../models/shareModel");
const { isOwner } = require("../policies/notePolicy");

async function shareNote(req, res) {
  try {
    const note = await noteModel.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    if (!isOwner(req.user, note)) {
      return res
        .status(403)
        .json({ error: "Not authorized to share this note" });
    }
    const { userId } = req.body;
    const share = await shareModel.createShare(note.id, userId);
    res.status(201).json(share);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function revokeShare(req, res) {
  try {
    const note = await noteModel.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    if (!isOwner(req.user, note)) {
      return res
        .status(403)
        .json({ error: "Not authorized to revoke access to this note" });
    }
    await shareModel.deleteShare(note.id, req.params.userId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { shareNote, revokeShare };
