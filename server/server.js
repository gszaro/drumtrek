const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("DrumTrek API is running");
});

app.get("/api/sessions", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ps.*, u.username 
       FROM practice_sessions ps 
       JOIN users u ON ps.user_id = u.id 
       ORDER BY ps.date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/sessions", async (req, res) => {
  const { user_id, date, duration_minutes, notes } = req.body;

  if (!user_id || !duration_minutes) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO practice_sessions (user_id, date, duration_minutes, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, date || new Date(), duration_minutes, notes || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ POST error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username FROM users ORDER BY username"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
});

app.get("/api/exercises", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM exercises ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch exercises:", err);
    res.status(500).json({ error: "Failed to load exercises" });
  }
});

app.post("/api/session_exercises", async (req, res) => {
  const { session_id, exercise_id, reps, tempo, name } = req.body;

  if (!session_id || (!exercise_id && !name)) {
    return res.status(400).json({ error: "Missing exercise reference" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO session_exercises (session_id, exercise_id, name, reps, tempo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        session_id,
        exercise_id || null,
        name || null,
        reps || null,
        tempo || null,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Failed to add session exercise:", err);
    res.status(500).json({ error: "Failed to add session exercise" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
