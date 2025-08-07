const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("Activity Tracker API is running");
});

// ===== USERS =====
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY username");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
});

// ===== EXERCISES (master list of activity details) =====
const exercisesRoutes = require("./routes/exercisesRoutes");
app.use("/api/exercises", exercisesRoutes);

// ===== LOG DETAILS (individual line items for a log) =====
app.post("/api/log-details", async (req, res) => {
  const { session_id, exercise_id, reps, tempo, name } = req.body;

  if (!session_id || (!exercise_id && !name)) {
    return res.status(400).json({ error: "Missing detail reference" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO log_details (session_id, exercise_id, name, reps, tempo)
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
    console.error("❌ Failed to add log detail:", err);
    res.status(500).json({ error: "Failed to add log detail" });
  }
});

// ===== LOGS (activity logs with their details) =====
const logsRoutes = require("./routes/logsRoutes");
app.use("/api/logs", logsRoutes);

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
