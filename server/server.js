const express = require('express');
const cors = require('cors');
const pool = require('./db/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;


app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('DrumTrek API is running');
});

app.get('/api/sessions', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ps.*, u.username 
       FROM practice_sessions ps 
       JOIN users u ON ps.user_id = u.id 
       ORDER BY ps.date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
