import React, { useState, useEffect } from "react";

function AddLogForm({ onLogAdded }) {
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [details, setDetails] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [detailId, setDetailId] = useState("");
  const [reps, setReps] = useState("");
  const [tempo, setTempo] = useState("");
  const [customDetailName, setCustomDetailName] = useState("");

  useEffect(() => {
    async function fetchUsersAndDetails() {
      const [usersRes, detailsRes] = await Promise.all([
        fetch("http://localhost:5050/api/users"),
        fetch("http://localhost:5050/api/details"),
      ]);
      const usersData = await usersRes.json();
      const detailsData = await detailsRes.json();
      setUsers(usersData);
      setDetails(detailsData);
    }
    fetchUsersAndDetails();
  }, []);

  const handleAddDetail = () => {
    if (!detailId && !customDetailName.trim()) {
      alert("Select a detail or enter a custom detail name");
      return;
    }

    let name = "";
    let activity_detail_id = null;

    if (detailId === "custom") {
      name = customDetailName.trim();
    } else {
      const selected = details.find((d) => d.id === Number(detailId));
      if (selected) {
        name = selected.detail_name;
        activity_detail_id = selected.id;
      }
    }

    setSelectedDetails([
      ...selectedDetails,
      { activity_detail_id, name, reps: Number(reps), tempo: Number(tempo) },
    ]);

    setDetailId("");
    setReps("");
    setTempo("");
    setCustomDetailName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const log = {
      user_id: Number(userId),
      date,
      duration: Number(duration),
      description,
    };

    const res = await fetch("http://localhost:5050/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });

    if (res.ok) {
      const newLog = await res.json();

      // Save each detail for this log
      for (let d of selectedDetails) {
        await fetch("http://localhost:5050/api/log-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            log_id: newLog.id,
            activity_detail_id: d.activity_detail_id,
            reps: d.reps,
            tempo: d.tempo,
            name: d.name,
          }),
        });
      }

      onLogAdded(newLog);
      setUserId("");
      setDate("");
      setDuration("");
      setDescription("");
      setSelectedDetails([]);
    } else {
      alert("Failed to add log");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Activity Log</h3>
      <div>
        <label>User: </label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        >
          <option value="">Select user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Date: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label>Duration (min): </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Description: </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <h4>Add Activity Details</h4>
      <div>
        <label>Detail: </label>
        <select value={detailId} onChange={(e) => setDetailId(e.target.value)}>
          <option value="">Select</option>
          {details.map((d) => (
            <option key={d.id} value={d.id}>
              {d.detail_name}
            </option>
          ))}
          <option value="custom">Custom Detail</option>
        </select>
      </div>

      {detailId === "custom" && (
        <div>
          <label>Custom Name: </label>
          <input
            type="text"
            value={customDetailName}
            onChange={(e) => setCustomDetailName(e.target.value)}
          />
        </div>
      )}

      <div>
        <label>Reps: </label>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
      </div>

      <div>
        <label>Tempo: </label>
        <input
          type="number"
          value={tempo}
          onChange={(e) => setTempo(e.target.value)}
        />
      </div>

      <button type="button" onClick={handleAddDetail}>
        Add Detail
      </button>

      <ul>
        {selectedDetails.map((d, idx) => (
          <li key={idx}>
            {d.name} – {d.reps || "-"} reps @ {d.tempo || "-"} BPM
          </li>
        ))}
      </ul>

      <button type="submit">Add Log</button>
    </form>
  );
}

export default AddLogForm;
