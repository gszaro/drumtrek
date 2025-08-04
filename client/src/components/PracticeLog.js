import React from 'react';

function PracticeLog({ sessions }) {
  return (
    <div>
      <h2>Practice Sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            <strong>{session.username}</strong> – {session.duration_minutes} min on {new Date(session.date).toDateString()}  
            <br />
            <em>{session.notes}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PracticeLog;
