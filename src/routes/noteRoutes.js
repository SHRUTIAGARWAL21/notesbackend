const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { shareNote, revokeShare } = require("../controllers/shareController");

const {
  createNote,
  getMyNotes,
  getNote,
  updateNote,
  deleteNote,
  updateNoteVisibility,
} = require("../controllers/noteController");

const router = express.Router();

router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getMyNotes);
router.get("/:id", authMiddleware, getNote);
router.put("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);
router.patch("/:id/visibility", authMiddleware, updateNoteVisibility);

router.post("/:id/shares", authMiddleware, shareNote);
router.delete("/:id/shares/:userId", authMiddleware, revokeShare);

module.exports = router;
