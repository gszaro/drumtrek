DROP TABLE IF EXISTS log_details;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT
);

CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  difficulty TEXT,
  description TEXT
);

CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  duration INTEGER NOT NULL,
  description TEXT
);

CREATE TABLE log_details (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES activity_logs(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id),
  reps INTEGER,
  tempo INTEGER,
  name TEXT
);
