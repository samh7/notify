require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ data: "Hello World" });
});

// create account
app.post("/create-account", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }
  const isUserExist = await User.findOne({ username: username });
  const isUserEmailExist = await User.findOne({ email: email });

  if (isUserExist || isUserEmailExist) {
    return res
      .status(400)
      .json({ error: true, message: "User already exists" });
  }

  const user = new User({ username, email, password });
  await user.save();
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
  return res.json({
    error: false,
    user,
    accessToken,
    message: "Account created successfully",
  });
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const userInfo = await User.findOne({ email: email });
  if (!userInfo) {
    return res.status(400).json({ error: true, message: "User not found" });
  }
  if (userInfo.password !== password) {
    return res.status(400).json({ error: true, message: "Invalid password" });
  }

  const user = { user: userInfo };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
  return res.json({
    error: false,
    email,
    accessToken,
    message: "Login successful",
  });
});

// Get user
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.status(400).json({ error: true, message: "User not found" });
  }
  return res.json({
    error: false,
    user: {
      username: isUser.username,
      email: isUser.email,
      _id: isUser._id,
      createdAt: isUser.createdAt,
    },
    message: "User retrieved successfully",
  });
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags, pin, timer } = req.body;
  const { user } = req.user;
  if (!title || !content) {
    return res
      .status(400)
      .json({ error: true, message: "Title and content are required" });
  }
  try {
    const note = new Note({
      userId: user._id,
      title,
      content,
      tags: tags || [],
      pin: pin || false,
      timer: timer || null,
    });
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, pin, timer } = req.body;
  const { user } = req.user;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: true, message: "Title and content are required" });
  }
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (pin) note.pin = pin;
    if (timer) note.timer = timer;

    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ userId: user._id }).sort({
      createdAt: -1,
    });
    // .sort((a, b) => a.pin - b.pin);
    return res.json({
      error: false,
      notes,
      meddage: "All noted retrieved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const noteId = req.params.noteId;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }
    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({ error: false, message: "Note deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// update pin
app.put("/update-pin/:noteId", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { pin } = req.body;
  const noteId = req.params.noteId;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    note.pin = !note.pin;
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Pin updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
