const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://gregoryszaro@localhost:5432/drumtrek'
});

module.exports = pool;
