DrumTrek — Client
React frontend for DrumTrek, a drumming practice tracker. Connects to the Node/Express API to list, add, edit, and delete practice logs.

Features
View practice logs with date, duration, description, and exercise details

Add new logs with per-exercise reps/tempo

Edit or delete existing logs

Simple, responsive UI

Prerequisites
Node.js 18+ and npm

DrumTrek server running (default: http://localhost:5050)

Environment
Create /client/.env (no quotes):

ini
Copy
Edit
REACT_APP_API_BASE_URL=http://localhost:5050
If omitted, the app defaults to http://localhost:5050.

Install & Run
bash
Copy
Edit

# from repo root

cd client
npm install
npm start
App runs at http://localhost:3000.

Scripts
bash
Copy
Edit
npm start # dev server with hot reload
npm run build # production build in /build
npm test # react-scripts tests (if configured)
npm run lint # optional, if ESLint is set up
API Expectations
The client expects these endpoints on the server:

GET /api/logs → list logs

POST /api/logs → create log

PUT /api/logs/:id → update log

DELETE /api/logs/:id → delete log

Response shape (example):

json
Copy
Edit
[
{
"id": 1,
"user_id": 1,
"date": "2025-08-01T04:00:00.000Z",
"duration": 45,
"description": "Paradiddles and transitions",
"username": "gregdrums",
"details": [
{"name":"Paradiddle","reps":4,"tempo":90},
{"name":"Flam Tap","reps":3,"tempo":80}
]
}
]
Project Structure (client)
css
Copy
Edit
client/
src/
components/
ActivityLog.jsx
AddLogForm.jsx
EditLogForm.jsx
App.js
index.js
App.css
Common Gotchas
CORS: ensure the server enables CORS for http://localhost:3000.

API base URL: mismatch causes fetch failures—confirm REACT_APP_API_BASE_URL.

Pool/DB errors: if server logs show pool.query is not a function, verify pg setup and exports.

Build & Deploy
bash
Copy
Edit
npm run build

# serve /client/build with your static host or reverse-proxy behind your API
