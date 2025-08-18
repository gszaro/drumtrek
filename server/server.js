const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (_req, res) => res.send("✅ API is healthy"));

// API routes
app.use("/api/users", require("./routes/users"));
app.use("/api/exercises", require("./routes/exerciseRoutes"));
app.use("/api/logs", require("./routes/sessionRoutes"));

// Optional endpoint for adding a single log detail
const pool = require("./db");
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

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "client/build");
  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
