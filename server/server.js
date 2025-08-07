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
const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);

// ===== EXERCISES =====
const exerciseRoutes = require("./routes/exerciseRoutes"); // match your file
app.use("/api/exercises", exerciseRoutes);

// ===== LOG DETAILS (optional, single detail entry) =====
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

// ===== LOGS / SESSIONS =====
const sessionRoutes = require("./routes/sessionRoutes"); // updated from logsRoutes
app.use("/api/logs", sessionRoutes);

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
