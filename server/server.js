const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Health check route
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

// ===== ACTIVITY LOGS =====
app.get("/api/logs", async (req, res) => {
  try {
    const logResult = await pool.query(`
      SELECT al.*, u.username
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      ORDER BY al.date DESC
    `);

    const logs = logResult.rows;

    const detailResult = await pool.query(`
      SELECT ld.*, ad.detail_name AS activity_detail
      FROM log_details ld
      LEFT JOIN activity_details ad ON ld.activity_detail_id = ad.id
    `);

    const allDetails = detailResult.rows;

    const logsWithDetails = logs.map((log) => {
      const details = allDetails
        .filter((d) => d.log_id === log.id)
        .map((d) => ({
          name: d.activity_detail || d.name, // DB detail or custom name
          reps: d.reps,
          tempo: d.tempo,
        }));

      return { ...log, details };
    });

    res.json(logsWithDetails);
  } catch (err) {
    console.error("❌ Failed to fetch logs with details:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/logs", async (req, res) => {
  const { user_id, date, duration, description } = req.body;

  if (!user_id || !duration) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO activity_logs (user_id, date, duration, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, date || new Date(), duration, description || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ POST error:", err);
    res.status(500).json({ error: "Failed to create log" });
  }
});

// ===== ACTIVITY DETAILS (master list) =====
app.get("/api/details", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM activity_details ORDER BY detail_name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch details:", err);
    res.status(500).json({ error: "Failed to load details" });
  }
});

// ===== LOG DETAILS (individual log entries) =====
app.post("/api/log-details", async (req, res) => {
  const { log_id, activity_detail_id, reps, tempo, name } = req.body;

  if (!log_id || (!activity_detail_id && !name)) {
    return res.status(400).json({ error: "Missing detail reference" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO log_details (log_id, activity_detail_id, name, reps, tempo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        log_id,
        activity_detail_id || null,
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
