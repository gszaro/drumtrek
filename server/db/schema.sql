-- Drop tables if they exist (for development reset)
DROP TABLE IF EXISTS session_exercises;
DROP TABLE IF EXISTS practice_sessions;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- Exercises table
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  difficulty TEXT,
  description TEXT
);

-- Practice sessions table
CREATE TABLE practice_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date DATE DEFAULT CURRENT_DATE,
  duration_minutes INTEGER NOT NULL,
  notes TEXT
);

-- Join table for exercises practiced during a session
CREATE TABLE session_exercises (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES practice_sessions(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id),
  reps INTEGER,
  tempo INTEGER
);
