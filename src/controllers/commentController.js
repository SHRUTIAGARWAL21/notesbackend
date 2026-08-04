const noteModel = require("../models/noteModel");
const shareModel = require("../models/shareModel");
const commentModel = require("../models/commentModel");
const { isOwner, canView, canManage } = require("../policies/notePolicy");
const { isCommentAuthor } = require("../policies/commentPolicy");

async function createComment(req, res) {
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
        .json({ error: "Not authorized to comment on this note" });
    }
    const { content } = req.body;
    const comment = await commentModel.createComment({
      noteId: note.id,
      userId: req.user.id,
      content,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listComments(req, res) {
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
        .json({ error: "Not authorized to view comments on this note" });
    }
    const comments = await commentModel.getCommentsByNote(note.id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteComment(req, res) {
  try {
    const comment = await commentModel.getCommentById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    const note = await noteModel.getNoteById(comment.note_id);
    if (!isCommentAuthor(req.user, comment) && !canManage(req.user, note)) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this comment" });
    }
    await commentModel.deleteComment(comment.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createComment, listComments, deleteComment };
