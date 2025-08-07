import React, { useState } from "react";
import LogDetailModal from "./LogDetailModal";
import EditLogModal from "./EditLogModal";
import styles from "./formStyles.module.css";

function ActivityLog({
  logs,
  users = [],
  details = [],
  onEdit,
  onDeleteLog,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateDesc");
  const [selectedLog, setSelectedLog] = useState(null); // For view modal
  const [editLog, setEditLog] = useState(null); // For edit modal

  const filteredLogs = logs
    .filter((log) => {
      const term = searchTerm.toLowerCase();
      return (
        log.username.toLowerCase().includes(term) ||
        log.description.toLowerCase().includes(term) ||
        (log.details &&
          log.details.some((d) => d.name.toLowerCase().includes(term)))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dateAsc":
          return new Date(a.date) - new Date(b.date);
        case "dateDesc":
          return new Date(b.date) - new Date(a.date);
        case "durationAsc":
          return a.duration - b.duration;
        case "durationDesc":
          return b.duration - a.duration;
        case "usernameAsc":
          return a.username.localeCompare(b.username);
        case "usernameDesc":
          return b.username.localeCompare(a.username);
        default:
          return 0;
      }
    });

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Activity Logs</h2>

      <div className={styles.searchSortContainer}>
        <input
          type="text"
          placeholder="Search by user, description, or exercise"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.input}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.select}
        >
          <option value="dateDesc">Date ↓</option>
          <option value="dateAsc">Date ↑</option>
          <option value="durationDesc">Duration ↓</option>
          <option value="durationAsc">Duration ↑</option>
          <option value="usernameAsc">Username A–Z</option>
          <option value="usernameDesc">Username Z–A</option>
        </select>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredLogs.map((log) => (
          <li
            key={log.id}
            style={{
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #ccc",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <div>
              <strong>{log.username}</strong> —{" "}
              {new Date(log.date).toLocaleDateString()} — {log.duration} minutes
            </div>
            <em>{log.description}</em>

            <div style={{ marginTop: "0.5rem" }}>
              <button
                onClick={() => setSelectedLog(log)}
                className={`${styles.button} ${styles.detailButton}`}
                style={{ marginTop: "8px", marginRight: "8px" }}
              >
                View Details
              </button>
              <button
                onClick={() => setEditLog(log)}
                className={`${styles.button} ${styles.editButton}`}
                style={{ marginTop: "8px", marginRight: "8px" }}
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteLog(log.id)}
                className={`${styles.button} ${styles.deleteButton}`}
                style={{ marginTop: "8px" }}
              >
                Delete Log
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}

      {editLog && (
        <EditLogModal
          log={editLog}
          users={users}
          detailsMaster={details}
          onClose={() => setEditLog(null)}
          onUpdate={() => {
            setEditLog(null);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
}

export default ActivityLog;
