const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true, default: new Date().toLocaleString() },
  tags: { type: [String], default: [] },
  pin: { type: Boolean, default: false },
  timer: { type: Number, default: null, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
