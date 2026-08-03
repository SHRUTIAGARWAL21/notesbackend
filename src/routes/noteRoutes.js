const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
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

module.exports = router;
