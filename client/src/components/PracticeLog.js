import React, { useState } from "react";

function PracticeLog({ sessions }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h2>Practice Sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li
            key={session.id}
            onClick={() => toggleExpand(session.id)}
            style={{
              background: "white",
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <strong>{session.username}</strong> – {session.duration_minutes} min
            on {new Date(session.date).toDateString()}
            {expandedId === session.id && (
              <div style={{ marginTop: "1rem", textAlign: "left" }}>
                <p>
                  <strong>Notes:</strong> {session.notes}
                </p>

                {session.exercises && session.exercises.length > 0 && (
                  <div>
                    <strong>Exercises:</strong>
                    <ul>
                      {session.exercises.map((ex, i) => (
                        <li key={i}>
                          {ex.name} – {ex.reps || "-"} reps @ {ex.tempo || "-"}{" "}
                          BPM
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PracticeLog;
