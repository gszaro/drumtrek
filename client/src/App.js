import React, { useState, useEffect } from "react";
import ActivityLog from "./components/ActivityLog";
import AddLogForm from "./components/AddLogForm";
import EditLogForm from "./components/EditLogForm";
import "./App.css";

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editLogId, setEditLogId] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5050/api/logs");
      if (!res.ok) {
        throw new Error(`Error fetching logs: ${res.status}`);
      }
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      setError("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleLogAddedOrUpdated = () => {
    fetchLogs();
    setEditLogId(null);
  };

  // Optimistic delete
  const handleDeleteLog = async (logId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this log and all its exercises?"
      )
    )
      return;

    const previousLogs = [...logs];

    setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));

    try {
      const res = await fetch(`http://localhost:5050/api/logs/${logId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Delete failed");
      }
    } catch (err) {
      setLogs(previousLogs);
      alert(`Error deleting log: ${err.message}`);
    }
  };

  if (loading) return <p>Loading activity logs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ height: "1000vh", position: "relative" }}>
      {/* Activity Logs pinned top-left */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          width: "350px",
          maxHeight: "80vh",
          overflowY: "auto",
          fontSize: "0.9rem",
          padding: "1rem",
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          zIndex: 1000,
          textAlign: "center",
        }}
      >
        <ActivityLog
          logs={logs}
          onEdit={setEditLogId}
          onDeleteLog={handleDeleteLog}
        />
      </div>

      {/* Add/Edit Form container */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, calc(-50% - 1px))", // Moved up 20px for both Add & Edit
          width: "500px",
          maxHeight: "100vh",
          overflowY: "auto",
          padding: "1rem",
          border: "1px solid #555",
          backgroundColor: "#111",
          boxShadow: "0 0 15px rgba(0,0,0,0.7)",
          zIndex: 999,
          borderRadius: "20px",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        {editLogId ? (
          <EditLogForm
            logId={editLogId}
            onCancel={() => setEditLogId(null)}
            onUpdated={handleLogAddedOrUpdated}
          />
        ) : (
          <AddLogForm onLogAdded={handleLogAddedOrUpdated} />
        )}
      </div>
    </div>
  );
}

export default App;
