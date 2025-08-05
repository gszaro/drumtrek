const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// GET all logs with their details
router.get("/", async (req, res) => {
  try {
    const logResult = await pool.query(`
      SELECT al.id, al.user_id, al.date, al.duration, al.description, u.username
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      ORDER BY al.date DESC
    `);

    const logs = logResult.rows;

    const detailResult = await pool.query(`
      SELECT ld.session_id, ld.exercise_id, ld.reps, ld.tempo, ld.name, ad.detail_name
      FROM log_details ld
      LEFT JOIN activity_details ad ON ld.exercise_id = ad.id
    `);

    const allDetails = detailResult.rows;

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

    const logInsert = await client.query(
      `INSERT INTO activity_logs (user_id, date, duration, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [user_id, date || new Date(), duration, description || ""]
    );

    const logId = logInsert.rows[0].id;

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

// GET a single log by id with its details
router.get("/:id", async (req, res) => {
  const logId = parseInt(req.params.id, 10);
  if (isNaN(logId)) {
    return res.status(400).json({ error: "Invalid log id" });
  }

  try {
    const logResult = await pool.query(
      `SELECT al.id, al.user_id, al.date, al.duration, al.description, u.username
       FROM activity_logs al
       JOIN users u ON al.user_id = u.id
       WHERE al.id = $1`,
      [logId]
    );

    if (logResult.rows.length === 0) {
      return res.status(404).json({ error: "Log not found" });
    }

    const log = logResult.rows[0];

    const detailsResult = await pool.query(
      `SELECT ld.id, ld.session_id, ld.exercise_id, ld.reps, ld.tempo, ld.name, ad.detail_name
       FROM log_details ld
       LEFT JOIN activity_details ad ON ld.exercise_id = ad.id
       WHERE ld.session_id = $1`,
      [logId]
    );

    log.details = detailsResult.rows.map((d) => ({
      id: d.id,
      exercise_id: d.exercise_id,
      reps: d.reps,
      tempo: d.tempo,
      name: d.detail_name || d.name,
    }));

    res.json(log);
  } catch (err) {
    console.error("❌ Failed to fetch log:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update a log and replace its details
router.put("/:id", async (req, res) => {
  const logId = parseInt(req.params.id, 10);
  const { user_id, date, duration, description, details } = req.body;

  if (isNaN(logId)) {
    return res.status(400).json({ error: "Invalid log id" });
  }
  if (!user_id || !duration) {
    return res
      .status(400)
      .json({ error: "Missing required fields: user_id and duration" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE activity_logs
       SET user_id = $1, date = $2, duration = $3, description = $4
       WHERE id = $5`,
      [user_id, date || new Date(), duration, description || "", logId]
    );

    await client.query(`DELETE FROM log_details WHERE session_id = $1`, [
      logId,
    ]);

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
    res.json({ message: "Log and details updated" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Failed to update log:", err);
    res.status(500).json({ error: "Failed to update log" });
  } finally {
    client.release();
  }
});

// DELETE a whole log and its details
router.delete("/:id", async (req, res) => {
  const logId = parseInt(req.params.id, 10);
  if (isNaN(logId)) {
    return res.status(400).json({ error: "Invalid log id" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM log_details WHERE session_id = $1", [
      logId,
    ]);
    const result = await client.query(
      "DELETE FROM activity_logs WHERE id = $1",
      [logId]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Log not found" });
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Log deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Failed to delete log:", err);
    res.status(500).json({ error: "Failed to delete log" });
  } finally {
    client.release();
  }
});

module.exports = router;
