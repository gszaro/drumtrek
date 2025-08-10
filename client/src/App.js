import React, { useState, useEffect } from "react";
import ActivityLog from "./components/ActivityLog";
import AddLogForm from "./components/AddLogForm";
import "./App.css";

function App() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    setError(null);
    try {
      const res = await fetch("/api/logs");
      if (!res.ok) throw new Error(`Error fetching logs: ${res.status}`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError("Failed to load logs");
    }
  };

  const fetchUsersAndExercises = async () => {
    try {
      const [uRes, eRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/exercises"),
      ]);
      if (!uRes.ok) throw new Error("Users fetch failed");
      if (!eRes.ok) throw new Error("Exercises fetch failed");
      const [uData, eData] = await Promise.all([uRes.json(), eRes.json()]);
      setUsers(uData);
      setExercises(eData);
    } catch (err) {
      console.error(err);
      // Not fatal to the whole app, but edit modal lists will be empty if this fails
    }
  };

  const initialLoad = async () => {
    setLoading(true);
    await Promise.all([fetchLogs(), fetchUsersAndExercises()]);
    setLoading(false);
  };

  useEffect(() => {
    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    fetchLogs();
  };

  // Optimistic delete
  const handleDeleteLog = async (logId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this log and all its exercises?"
      )
    )
      return;

    const prev = [...logs];
    setLogs((cur) => cur.filter((l) => l.id !== logId));

    try {
      const res = await fetch(`/api/logs/${logId}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Delete failed");
      }
    } catch (err) {
      setLogs(prev);
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
          users={users}
          details={exercises}
          onDeleteLog={handleDeleteLog}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Add Form container */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, calc(-50% - 1px))",
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
        <AddLogForm onLogAdded={handleRefresh} />
      </div>
    </div>
  );
}

export default App;
