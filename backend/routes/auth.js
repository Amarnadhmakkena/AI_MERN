const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const router = express.Router();
const usersFile = path.join(__dirname, "..", "data", "users.json");

// Load Users
function loadUsers() {
  return JSON.parse(fs.readFileSync(usersFile, "utf8"));
}

// Save Users
function saveUsers(data) {
  fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
}

// Signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hash = await bcrypt.hash(password, 10);
  users.push({ username, password: hash });
  saveUsers(users);

  res.json({ message: "Account created successfully!" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) return res.status(400).json({ message: "Invalid username or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid username or password" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ message: "Login successful!", token });
});

module.exports = router;
