import React, { useState } from "react";
import LogDetailModal from "./LogDetailModal";
import EditLogModal from "./EditLogModal";
import styles from "./formStyles.module.css";

function ActivityLog({
  logs,
  users = [],
  details = [],
  onDeleteLog,
  onRefresh,
}) {
  // Search box state — filters logs by user, description, or exercise name
  const [searchTerm, setSearchTerm] = useState("");
  // Current sorting method (default: newest date first)
  const [sortBy, setSortBy] = useState("dateDesc");
  // State for the currently selected log when viewing details
  const [selectedLog, setSelectedLog] = useState(null);
  // State for the log currently being edited
  const [editLog, setEditLog] = useState(null);

  // Filter + sort the logs based on search term and sorting option
  const filteredLogs = (logs || [])
    .filter((log) => {
      const term = searchTerm.toLowerCase();
      const username = (log.username || "").toLowerCase();
      const description = (log.description || "").toLowerCase();
      const hasDetailMatch =
        Array.isArray(log.details) &&
        log.details.some((d) => (d.name || "").toLowerCase().includes(term));

      // Show logs if the search term matches username, description, or any exercise name
      return (
        username.includes(term) || description.includes(term) || hasDetailMatch
      );
    })
    .sort((a, b) => {
      // Sorting logic based on user’s selection
      switch (sortBy) {
        case "dateAsc":
          return new Date(a.date) - new Date(b.date);
        case "dateDesc":
          return new Date(b.date) - new Date(a.date);
        case "durationAsc":
          return (a.duration || 0) - (b.duration || 0);
        case "durationDesc":
          return (b.duration || 0) - (a.duration || 0);
        case "usernameAsc":
          return (a.username || "").localeCompare(b.username || "");
        case "usernameDesc":
          return (b.username || "").localeCompare(a.username || "");
        default:
          return 0;
      }
    });

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Activity Logs</h2>

      {/* Search + sort controls */}
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

      {/* Render filtered and sorted logs */}
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
            {/* Summary line for the log */}
            <div>
              <strong>{log.username || "Unknown"}</strong> —{" "}
              {log.date ? new Date(log.date).toLocaleDateString() : "—"} —{" "}
              {log.duration ?? 0} minutes
            </div>

            {/* Notes or placeholder if empty */}
            {log.description ? <em>{log.description}</em> : <em>No notes</em>}

            {/* Action buttons: view, edit, delete */}
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
                onClick={() => onDeleteLog && onDeleteLog(log.id)}
                className={`${styles.button} ${styles.deleteButton}`}
                style={{ marginTop: "8px" }}
              >
                Delete Log
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Detail modal */}
      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}

      {/* Edit modal */}
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
