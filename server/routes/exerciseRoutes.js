const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// GET all exercises (master list)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, difficulty, description FROM exercises ORDER BY name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch exercises:", err);
    res.status(500).json({ error: "Failed to load exercises" });
  }
});

// POST new exercise to the master list
router.post("/", async (req, res) => {
  const { name, difficulty, description } = req.body;

  if (!name || !difficulty) {
    return res
      .status(400)
      .json({ error: "Missing required fields: name and difficulty" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO exercises (name, difficulty, description)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, difficulty, description || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Failed to create exercise:", err);
    res.status(500).json({ error: "Failed to add exercise" });
  }
});

// PUT update an existing exercise
router.put("/:id", async (req, res) => {
  const exerciseId = parseInt(req.params.id, 10);
  const { name, difficulty, description } = req.body;

  if (isNaN(exerciseId)) {
    return res.status(400).json({ error: "Invalid exercise ID" });
  }

  try {
    const result = await pool.query(
      `UPDATE exercises SET name = $1, difficulty = $2, description = $3
       WHERE id = $4 RETURNING *`,
      [name, difficulty, description || "", exerciseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Failed to update exercise:", err);
    res.status(500).json({ error: "Failed to update exercise" });
  }
});

// DELETE an exercise
router.delete("/:id", async (req, res) => {
  const exerciseId = parseInt(req.params.id, 10);

  if (isNaN(exerciseId)) {
    return res.status(400).json({ error: "Invalid exercise ID" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM exercises WHERE id = $1 RETURNING *",
      [exerciseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    res.json({ message: "Exercise deleted", deleted: result.rows[0] });
  } catch (err) {
    console.error("❌ Failed to delete exercise:", err);
    res.status(500).json({ error: "Failed to delete exercise" });
  }
});

module.exports = router;
