-- Users
INSERT INTO users (username, email, password_hash) VALUES
  ('gregdrums', 'greg@example.com', NULL),
  ('jazzcat', 'jazz@example.com', NULL);

-- Exercises
INSERT INTO exercises (name, difficulty, description) VALUES
  ('Paradiddle', 'Intermediate', 'RLRR LRLL sticking pattern'),
  ('Double Stroke Roll', 'Beginner', 'RR LL RR LL...'),
  ('Flam Tap', 'Advanced', 'Flam followed by tap with alternating hands');

-- Activity Logs
INSERT INTO activity_logs (user_id, date, duration, description) VALUES
  (1, '2025-08-01', 45, 'Focused on paradiddles and transitions'),
  (2, '2025-08-02', 30, 'Warmups and double stroke roll cleanup');

-- Details
INSERT INTO log_details (session_id, exercise_id, reps, tempo) VALUES
  (1, 1, 4, 90),
  (1, 3, 3, 80),
  (2, 2, 5, 100);
