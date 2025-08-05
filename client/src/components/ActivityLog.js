import React, { useState } from "react";

function ActivityLog({ logs }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h2>Activity Logs</h2>
      <ul>
        {logs.map((log) => (
          <li
            key={log.id}
            onClick={() => toggleExpand(log.id)}
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
            <strong>{log.username}</strong> – {log.duration} min on{" "}
            {new Date(log.date).toDateString()}
            {expandedId === log.id && (
              <div style={{ marginTop: "1rem", textAlign: "left" }}>
                <p>
                  <strong>Description:</strong> {log.description}
                </p>
                {log.details && log.details.length > 0 && (
                  <div>
                    <strong>Details:</strong>
                    <ul>
                      {log.details.map((d, i) => (
                        <li key={i}>
                          {d.name} – {d.reps || "-"} reps @ {d.tempo || "-"} BPM
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

export default ActivityLog;
