const api = "http://localhost:5000";

// Register
document.getElementById("registerForm").addEventListener("submit", e => {
  e.preventDefault();
  fetch(`${api}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  }).then(res => res.json()).then(data => alert(data.message));
});

// Login
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  fetch(`${api}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value
    })
  }).then(res => res.json()).then(data => alert(data.message));
});

// Contact
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  fetch(`${api}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("contactName").value,
      email: document.getElementById("contactEmail").value,
      message: document.getElementById("contactMessage").value
    })
  }).then(res => res.json()).then(data => alert(data.message));
});
// Routes
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hash],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Registered successfully" });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ error: "User not found" });

    const user = result[0];
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: "Incorrect password" });

    res.json({ message: "Login successful" });
  });
});




const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// DB Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // your MySQL password
  database: "fittrack_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");
});

// Routes
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hash],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Registered successfully" });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ error: "User not found" });

    const user = result[0];
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: "Incorrect password" });

    res.json({ message: "Login successful" });
  });
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  db.query(
    "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Message sent" });
    }
  );
});

// GET - Retrieve all messages
app.get("/admin/messages", (req, res) => {
  const sql = "SELECT * FROM contacts ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error retrieving messages" });
    res.json(results);
  });
});

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
