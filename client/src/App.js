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

  if (loading) return <p>Loading activity logs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ height: "100vh", position: "relative" }}>
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
        <ActivityLog logs={logs} onEdit={setEditLogId} />
      </div>

      {/* Conditionally show Add or Edit form */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          maxHeight: "80vh",
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
