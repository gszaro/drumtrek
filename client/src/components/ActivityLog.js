import React, { useState, useMemo } from "react";
import styles from "./formStyles.module.css";

function ActivityLog({ logs, onEdit, onDeleteLog }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc");

  // Filter and sort logs in one pass
  const filteredAndSortedLogs = useMemo(() => {
    let filtered = logs.filter((log) => {
      const searchLower = searchTerm.toLowerCase();
      const inUsername = log.username.toLowerCase().includes(searchLower);
      const inDescription =
        log.description && log.description.toLowerCase().includes(searchLower);
      const inDetails =
        log.details &&
        log.details.some((d) =>
          d.name ? d.name.toLowerCase().includes(searchLower) : false
        );

      return inUsername || inDescription || inDetails;
    });

    switch (sortOption) {
      case "dateAsc":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "dateDesc":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "durationAsc":
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      case "durationDesc":
        filtered.sort((a, b) => b.duration - a.duration);
        break;
      case "usernameAsc":
        filtered.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case "usernameDesc":
        filtered.sort((a, b) => b.username.localeCompare(a.username));
        break;
      default:
        break;
    }

    return filtered;
  }, [logs, searchTerm, sortOption]);

  if (!logs.length) return <p>No activity logs found.</p>;

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Activity Logs</h2>

      {/* Search Above Sort */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by user, description, or exercise"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.input}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={styles.select}
          style={{ width: "100%" }}
        >
          <option value="dateDesc">Date (Newest First)</option>
          <option value="dateAsc">Date (Oldest First)</option>
          <option value="durationDesc">Duration (Longest First)</option>
          <option value="durationAsc">Duration (Shortest First)</option>
          <option value="usernameAsc">Username (A–Z)</option>
          <option value="usernameDesc">Username (Z–A)</option>
        </select>
      </div>

      {/* Logs List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredAndSortedLogs.map((log) => (
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
              className={`${styles.button} ${styles.editButton}`}
              style={{ marginRight: "10px", marginTop: "8px" }}
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityLog;
