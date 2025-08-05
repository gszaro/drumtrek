import React from "react";

function ActivityLog({ logs, onEdit, onDeleteLog }) {
  if (!logs.length) return <p>No activity logs found.</p>;

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Activity Logs</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {logs.map((log) => (
          <li
            key={log.id}
            style={{
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #ccc",
            }}
          >
            <strong>{log.username}</strong> —{" "}
            {new Date(log.date).toLocaleDateString()} — {log.duration} minutes
            <br />
            <em>{log.description}</em>
            {log.details && log.details.length > 0 && (
              <ul>
                {log.details.map((detail, index) => (
                  <li key={index}>
                    {detail.name} — {detail.reps} reps @ {detail.tempo} bpm
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => onEdit(log.id)}
              style={{ marginTop: "8px", marginRight: "10px" }}
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteLog(log.id)}
              style={{
                marginTop: "8px",
                backgroundColor: "#a00",
                color: "#fff",
                border: "none",
                padding: "6px 10px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Delete Log
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityLog;
