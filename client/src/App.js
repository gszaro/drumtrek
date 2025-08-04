import React, { useState, useEffect } from "react";
import PracticeLog from "./components/PracticeLog";
import AddSessionForm from "./components/AddSessionForm";
import "./App.css";

function App() {
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    const res = await fetch("http://localhost:5050/api/sessions");
    const data = await res.json();
    setSessions(data);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSessionAdded = (newSession) => {
    fetchSessions();
  };

  return (
    <div className="App">
      <h1>DrumTrek</h1>
      <AddSessionForm onSessionAdded={handleSessionAdded} />
      <PracticeLog sessions={sessions} />
    </div>
  );
}

export default App;
