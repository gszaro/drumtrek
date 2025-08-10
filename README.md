# drumtrek

Full-stack PERN Activity Tracker with detailed logging and expandable records
DrumTrek
Overview
DrumTrek is a full-stack application designed to help drummers track their practice sessions with precision and clarity. It combines a React-based client interface with an Express and PostgreSQL backend to provide a complete end-to-end logging system.

Whether you are practicing rudiments, learning new pieces, or refining advanced techniques, DrumTrek allows you to record detailed logs, manage exercises, and review your progress over time.

Features
User selection and exercise management

Full CRUD functionality for practice logs

Search and sorting for activity logs

Modal-based detail and edit views

Responsive, form-validated input

PostgreSQL-powered backend with clean API structure

Seed and schema files for quick database setup

Technologies Used
Frontend

React

JavaScript (ES6+)

CSS Modules

Fetch API

Backend

Node.js

Express.js

PostgreSQL

pg (node-postgres)

Project Structure
pgsql
Copy
Edit
drumtrek/
├── client/ # React frontend
│ ├── src/
│ ├── public/
│ └── package.json
├── server/ # Express backend
│ ├── routes/
│ ├── db.js
│ ├── schema.sql
│ ├── seed.sql
│ └── package.json
└── README.md
Getting Started
Prerequisites
Node.js (v14+ recommended)

npm or yarn

PostgreSQL

1. Clone the Repository
   bash
   Copy
   Edit
   git clone https://github.com/your-username/drumtrek.git
   cd drumtrek
2. Setup the Server
   bash
   Copy
   Edit
   cd server
   npm install
   createdb drumtrek
   psql -d drumtrek -f schema.sql
   psql -d drumtrek -f seed.sql
   npm start
   Server runs on http://localhost:5050

3. Setup the Client
   Open a new terminal:

bash
Copy
Edit
cd client
npm install
npm start
Client runs on http://localhost:3000

Ensure client/package.json contains:

json
Copy
Edit
"proxy": "http://localhost:5050"
API Endpoints
Users

GET /api/users – Retrieve all users

Exercises

GET /api/exercises – Retrieve all exercises

Logs

GET /api/logs – Retrieve all logs

POST /api/logs – Create new log

PUT /api/logs/:id – Update existing log

DELETE /api/logs/:id – Delete a log

Development Notes
Client and server are developed and run separately during local development.

Database structure and initial data are defined in schema.sql and seed.sql.

Make sure the server is running before using the client.
