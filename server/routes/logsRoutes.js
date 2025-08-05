const express = require("express");
const router = express.Router();
const pool = require("../db/db"); // Adjust path if needed

// GET all logs with their details
router.get("/", async (req, res) => {
  try {
    // Fetch logs with user info
    const logResult = await pool.query(`
      SELECT al.id, al.user_id, al.date, al.duration, al.description, u.username
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      ORDER BY al.date DESC
    `);

    const logs = logResult.rows;

    // Fetch all details with joined activity details
    const detailResult = await pool.query(`
      SELECT ld.session_id, ld.exercise_id, ld.reps, ld.tempo, ld.name, ad.detail_name
      FROM log_details ld
      LEFT JOIN activity_details ad ON ld.exercise_id = ad.id
    `);

    const allDetails = detailResult.rows;

    // Merge details into logs
    const logsWithDetails = logs.map((log) => {
      const details = allDetails
        .filter((d) => d.session_id === log.id)
        .map((d) => ({
          name: d.detail_name || d.name,
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

// POST new log with details in one request
router.post("/", async (req, res) => {
  const { user_id, date, duration, description, details } = req.body;
  const client = await pool.connect();

  if (!user_id || !duration) {
    return res
      .status(400)
      .json({ error: "Missing required fields: user_id and duration" });
  }

  try {
    await client.query("BEGIN");

    // Insert the main log
    const logInsert = await client.query(
      `INSERT INTO activity_logs (user_id, date, duration, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [user_id, date || new Date(), duration, description || ""]
    );

    const logId = logInsert.rows[0].id;

    // Insert each detail if provided
    if (Array.isArray(details) && details.length > 0) {
      for (const d of details) {
        await client.query(
          `INSERT INTO log_details (session_id, exercise_id, reps, tempo, name)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            logId,
            d.exercise_id || null,
            d.reps || null,
            d.tempo || null,
            d.name || null,
          ]
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Log and details created", log_id: logId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Failed to create log with details:", err);
    res.status(500).json({ error: "Failed to create log and details" });
  } finally {
    client.release();
  }
});

module.exports = router;
