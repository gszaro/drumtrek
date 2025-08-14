import React, { useState, useEffect } from "react";
import ActivityLog from "./components/ActivityLog";
import AddLogForm from "./components/AddLogForm";
import "./App.css";

function App() {
  // State for activity logs
  const [logs, setLogs] = useState([]);
  // State for users list (used in dropdowns or reference)
  const [users, setUsers] = useState([]);
  // State for exercises list (used in dropdowns or reference)
  const [exercises, setExercises] = useState([]);
  // Loading indicator for initial and refresh fetches
  const [loading, setLoading] = useState(true);
  // Error state for displaying fetch issues
  const [error, setError] = useState(null);

  // Fetch the activity logs from backend
  const fetchLogs = async () => {
    setError(null); // clear any previous errors
    try {
      const res = await fetch("/api/logs");
      if (!res.ok) throw new Error(`Error fetching logs: ${res.status}`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError("Failed to load logs"); // user-friendly error
    }
  };

  // Fetch both users and exercises in parallel
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
      // Not fatal — the app still works, but dropdowns/edit lists may be empty
    }
  };

  // Perform initial load of all necessary data
  const initialLoad = async () => {
    setLoading(true);
    await Promise.all([fetchLogs(), fetchUsersAndExercises()]);
    setLoading(false);
  };

  // Run once when the component mounts
  useEffect(() => {
    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger logs refresh (used after adding/deleting a log)
  const handleRefresh = () => {
    fetchLogs();
  };

  // Delete a log (with optimistic UI update)
  const handleDeleteLog = async (logId) => {
    // Ask the user for confirmation before removing
    if (
      !window.confirm(
        "Are you sure you want to delete this log and all its exercises?"
      )
    )
      return;

    // Save current logs in case we need to rollback
    const prev = [...logs];
    // Remove the log locally for immediate UI feedback
    setLogs((cur) => cur.filter((l) => l.id !== logId));

    try {
      const res = await fetch(`/api/logs/${logId}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Delete failed");
      }
    } catch (err) {
      // Roll back to previous logs if deletion fails
      setLogs(prev);
      alert(`Error deleting log: ${err.message}`);
    }
  };

  // Loading and error handling states
  if (loading) return <p>Loading activity logs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ height: "1000vh", position: "relative" }}>
      {/* Activity Log panel (fixed top-left) */}
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

      {/* Add Log Form panel (fixed center) */}
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
