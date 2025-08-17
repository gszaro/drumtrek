DrumTrek
Practice Smarter. Play Better.

Overview
DrumTrek is a full-stack practice tracking application built as the capstone project for Codecademy’s Full-Stack Certificate program.
Designed for drummers who want precision, accountability, and measurable progress, it features a clean React interface and a robust Node.js + PostgreSQL backend.
With DrumTrek, you can log practice sessions, manage exercises, and review growth over time.

Why DrumTrek?

- Centralized practice logging for all exercises
- Track what you worked on, duration, and tempo
- Designed for hobbyists and professionals
- Quick to use, powerful for long-term tracking

Features

- User Management: Add or select drummers
- Exercise Library: Manage custom exercises
- Detailed Logging: Record duration, tempo, type
- CRUD Support: Add, edit, delete logs and users
- Intuitive Modals: Clean editing experience
- Responsive Design: Desktop and mobile ready
- PostgreSQL-Backed: Reliable, scalable storage

Tech Stack
Frontend:

- React (Hooks)
- JavaScript (ES6+)
- CSS Modules

Backend:

- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)

Installation

1. Clone the Repository:
   git clone https://github.com/gszaro/drumtrek.git
   cd drumtrek

2. Setup the Backend:
   cd server
   npm install
   createdb drumtrek
   psql -d drumtrek -f schema.sql
   psql -d drumtrek -f seed.sql
   npm start
   Backend runs on http://localhost:5050

3. Setup the Frontend:
   cd client
   npm install
   npm start
   Frontend runs on http://localhost:3000

   Make sure client/package.json contains:
   "proxy": "http://localhost:5050"

API Overview
Users:

- GET /api/users
- POST /api/users

Exercises:

- GET /api/exercises
- POST /api/exercises

Logs:

- GET /api/logs
- POST /api/logs
- PUT /api/logs/:id
- DELETE /api/logs/:id

Development Notes

- Backend must be running before frontend
- Seed data available for testing
- Structure is split into client (React) and server (Express) for modular development

Future Improvements

- Authentication and user accounts
- Graphical progress visualization
- Mobile-first UI optimization
- Export logs to CSV or PDF
