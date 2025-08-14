const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON bodies

// Health check route for quick status verification
app.get("/", (_req, res) => res.send("Activity Tracker API is running"));

// API routes
app.use("/api/users", require("./routes/users")); // User CRUD
app.use("/api/exercises", require("./routes/exerciseRoutes")); // Exercise CRUD
app.use("/api/logs", require("./routes/sessionRoutes")); // Session/log CRUD

// Optional endpoint for adding a single log detail directly
// This is not required by the current UI, but can be used by API clients
const pool = require("./db");
app.post("/api/log-details", async (req, res) => {
  const { session_id, exercise_id, reps, tempo, name } = req.body;

  // Basic validation
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
