DrumTrek Client
Overview
The DrumTrek client is a React-based web application that provides an intuitive interface for tracking drumming practice sessions. It connects to the DrumTrek API to manage users, exercises, and practice logs. The client features a clean user experience for creating, viewing, editing, and deleting practice logs.

Features
User selection and exercise management

Create, read, update, and delete (CRUD) logs

Search and sort functionality for activity logs

Modal-based detail and edit views

Responsive form validation

Integration with the DrumTrek API

Technologies Used
React

JavaScript (ES6+)

CSS Modules for styling

Fetch API for data requests

Modal components for details and editing

Getting Started
Prerequisites
Node.js (v14+ recommended)

npm or yarn

DrumTrek server running locally

Installation
bash
Copy
Edit
cd client
npm install
Running the Client
bash
Copy
Edit
npm start
The application will run at http://localhost:3000.

Configuration
Ensure the package.json contains:

json
Copy
Edit
"proxy": "http://localhost:5050"
This allows API calls to be proxied to the server during development.