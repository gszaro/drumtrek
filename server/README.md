DrumTrek Server
Overview
The DrumTrek server is an Express-based API backed by PostgreSQL. It powers the DrumTrek application by managing users, exercises, and practice logs. The server exposes endpoints for full CRUD operations and serves as the data layer for the client.

Features
PostgreSQL database integration

CRUD endpoints for users, exercises, and logs

Modular routing for clean organization

Input validation and error handling

Seed and schema SQL files for quick setup

Technologies Used
Node.js

Express.js

PostgreSQL

pg (node-postgres)

SQL schema and seed files

Getting Started
Prerequisites
Node.js (v14+ recommended)

npm or yarn

PostgreSQL installed locally

Installation
bash
Copy
Edit
cd server
npm install
Database Setup
Create the database:

bash
Copy
Edit
createdb drumtrek
Run the schema:

bash
Copy
Edit
psql -d drumtrek -f schema.sql
Seed initial data:

bash
Copy
Edit
psql -d drumtrek -f seed.sql
Running the Server
bash
Copy
Edit
npm start
The API will be available at http://localhost:5050.

API Endpoints
GET /api/users – Retrieve all users

GET /api/exercises – Retrieve all exercises

GET /api/logs – Retrieve all practice logs

POST /api/logs – Add a new log

PUT /api/logs/:id – Update an existing log

DELETE /api/logs/:id – Delete a log