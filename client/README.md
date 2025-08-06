Activity Log Tracker
Overview
Activity Log Tracker is a full-stack web application built with React, Express, and PostgreSQL for tracking and managing activity logs with detailed exercise entries. The app supports full CRUD operations, offers a clean and responsive interface, and ensures instant updates with an optimized user experience.

This project demonstrates modern JavaScript development practices, backend data management, and frontend state optimization. It is designed to function as an internal productivity and tracking tool with scalability in mind.

Features
Core Functionality
View all activity logs with associated exercise details

Add new logs with multiple exercise entries

Edit logs and update associated details

Optimistic deletion for instant UI updates without page refresh

Robust backend delete route with transactional safety and rollback support

User Experience
Responsive UI designed for ease of use

Real-time visual updates on data changes

Clear error handling and confirmation prompts

Scrollable log list with fixed position for quick navigation

Backend Architecture
Node.js and Express REST API

PostgreSQL relational database with normalized schema

Secure parameterized queries to prevent SQL injection

Structured route organization for scalability

Transactional handling for create, update, and delete operations

Tech Stack
Frontend

React

JavaScript (ES6+)

CSS3

Backend

Node.js

Express

PostgreSQL

pg (node-postgres)

Installation
Prerequisites
Node.js v16+

PostgreSQL 13+

Setup Steps
Clone the repository

bash
Copy
Edit
git clone https://github.com/yourusername/activity-log-tracker.git
cd activity-log-tracker
Install dependencies for backend and frontend

bash
Copy
Edit
cd server
npm install
cd ../client
npm install
Configure the database connection

Create a PostgreSQL database

Update .env in the backend with your database URL

Example .env file:

ini
Copy
Edit
DATABASE_URL=postgresql://username:password@localhost:5432/yourdbname
PORT=5050
Run database migrations

Create tables for users, activity_logs, log_details, and activity_details

Seed initial data if required

Start the development servers

bash
Copy
Edit

# Start backend

cd server
npm run dev

# Start frontend

cd ../client
npm start
Folder Structure
bash
Copy
Edit
activity-log-tracker/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── App.js # Main app component
│ │ └── index.js # React entry point
│ └── public/
├── server/ # Express backend
│ ├── routes/ # API route definitions
│ ├── db/ # Database connection
│ ├── server.js # Server entry point
│ └── .env # Environment variables
└── README.md
Roadmap
Planned enhancements include:

Search and filter functionality for activity logs

Sortable columns for date, duration, and username

Role-based access control for different user permissions

Activity analytics dashboard with charts and trends

Export logs to PDF or CSV formats

Real-time updates with WebSockets
