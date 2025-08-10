DrumTrek

Practice Smarter. Play Better.
DrumTrek is a full-stack practice tracking application built for drummers who want precision, accountability, and measurable progress in their craft. Featuring a clean React interface and a robust Node.js + PostgreSQL backend, DrumTrek lets you log practice sessions, manage exercises, and review your growth over time.

Why DrumTrek?
Centralized practice logging for all your exercises
Track what you worked on, for how long, and at what tempo
Designed for both casual hobbyists and professional musicians
Simple enough for quick use, powerful enough for long-term data tracking

Features
User Management – Select from registered drummers or add new ones
Exercise Library – Store and manage exercises for quick selection
Detailed Logging – Record duration, tempo, and exercise type
Full CRUD Support – Add, edit, and delete logs, exercises, and users
Modals for Editing & Details – Keep the interface clean and intuitive
Responsive Design – Works on desktop and mobile
PostgreSQL-Backed – Reliable and scalable data storage

Tech Stack
Frontend
React (Hooks)
JavaScript (ES6+)
CSS Modules

Backend
Node.js
Express.js
PostgreSQL
pg (node-postgres)



Installation
1. Clone the Repository
git clone https://github.com/your-username/drumtrek.git
cd drumtrek

3. Setup the Backend
cd server
npm install
createdb drumtrek
psql -d drumtrek -f schema.sql
psql -d drumtrek -f seed.sql
npm start
Backend runs on http://localhost:5050

4. Setup the Frontend
In a new terminal:
cd client
npm install
npm start
Frontend runs on http://localhost:3000

Make sure client/package.json contains:
"proxy": "http://localhost:5050"

API Overview
Users
GET /api/users
POST /api/users

Exercises

GET /api/exercises
POST /api/exercises

Logs

GET /api/logs
POST /api/logs
PUT /api/logs/:id
DELETE /api/logs/:id

Development Notes
The backend must be running before the frontend is started.
Use the seed data for quick testing or modify it for custom exercises and users.
The structure is split into client (React) and server (Express) for modular development.

Future Improvements
Authentication and user accounts
Graphical stats and progress tracking
Mobile-first layout optimization
Export logs to CSV or PDF

