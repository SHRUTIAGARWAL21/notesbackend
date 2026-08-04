const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { shareNote, revokeShare } = require("../controllers/shareController");

const {
  createNote,
  getMyNotes,
  getVisibleNotes,
  getNote,
  updateNote,
  deleteNote,
  updateNoteVisibility,
} = require("../controllers/noteController");

const {
  createComment,
  listComments,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getMyNotes);
router.get("/visible", authMiddleware, getVisibleNotes);
router.get("/:id", authMiddleware, getNote);
router.put("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);
router.patch("/:id/visibility", authMiddleware, updateNoteVisibility);

router.post("/:id/shares", authMiddleware, shareNote);
router.delete("/:id/shares/:userId", authMiddleware, revokeShare);

router.post("/:id/comments", authMiddleware, createComment);
router.get("/:id/comments", authMiddleware, listComments);
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);

module.exports = router;
