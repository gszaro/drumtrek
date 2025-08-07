const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// GET all exercises
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM activity_details ORDER BY detail_name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch exercises:", err);
    res.status(500).json({ error: "Failed to load exercises" });
  }
});

// OPTIONAL: Add POST, PUT, DELETE routes here later if you want admin editing

module.exports = router;
