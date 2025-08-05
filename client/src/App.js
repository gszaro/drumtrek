import React, { useState, useEffect } from "react";
import ActivityLog from "./components/ActivityLog";
import AddLogForm from "./components/AddLogForm";
import "./App.css";

function App() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/logs");
      if (!res.ok) {
        throw new Error(`Error fetching logs: ${res.status}`);
      }
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleLogAdded = () => {
    fetchLogs();
  };

  return (
    <div className="App">
      <h1>Activity Tracker</h1>
      <AddLogForm onLogAdded={handleLogAdded} />
      <ActivityLog logs={logs} />
    </div>
  );
}

export default App;
