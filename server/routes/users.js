const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all users
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
});

// CREATE user
router.post("/", async (req, res) => {
  const { username, email = null, password_hash = null } = req.body || {};
  if (!username) return res.status(400).json({ error: "Username is required" });

  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, password_hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Failed to create user:", err);
    res.status(500).json({ error: "Failed to add user" });
  }
});

// UPDATE username
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: "Username is required" });

  try {
    const result = await pool.query(
      `UPDATE users SET username = $1 WHERE id = $2
       RETURNING id, username, email`,
      [username, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Failed to update user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("❌ Failed to delete user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
