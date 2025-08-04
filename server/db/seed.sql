-- Users
INSERT INTO users (username, email, password_hash)
VALUES
  ('gregdrums', 'greg@example.com', 'hashed_password_1'),
  ('jazzcat', 'jazz@example.com', 'hashed_password_2');

-- Exercises
INSERT INTO exercises (name, difficulty, description)
VALUES
  ('Paradiddle', 'Intermediate', 'RLRR LRLL sticking pattern'),
  ('Double Stroke Roll', 'Beginner', 'RR LL RR LL...'),
  ('Flam Tap', 'Advanced', 'Flam followed by tap with alternating hands');

-- Practice Sessions
INSERT INTO practice_sessions (user_id, date, duration_minutes, notes)
VALUES
  (1, '2025-08-01', 45, 'Focused on paradiddles and transitions'),
  (2, '2025-08-02', 30, 'Warmups and double stroke roll cleanup');

-- Session Exercises
INSERT INTO session_exercises (session_id, exercise_id, reps, tempo)
VALUES
  (1, 1, 4, 90),
  (1, 3, 3, 80),
  (2, 2, 5, 100);
