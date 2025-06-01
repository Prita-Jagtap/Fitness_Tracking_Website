const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json()); // Use express built-in json parser

// DB Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "fittrack_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");
});

// Register Endpoint
app.post("/register", (req, res) => {
  const {
    name,
    email,
    password,
    gender,
    height,
    weight,
    activityLevel,
    goal,
    dob
  } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  const query = `
    INSERT INTO users 
    (name, email, password, gender, height, weight, activity_level, goal, dob)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [name, email, hash, gender, height, weight, activityLevel, goal, dob], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Registered successfully" });
  });
});

// Login Endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful" });
  });
});

// Contact endpoint
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

  db.query(query, [name, email, message], (err) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).json({ error: "Failed to save message" });
    }
    res.json({ message: "Message sent successfully" });
  });
});



// Server Start
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
