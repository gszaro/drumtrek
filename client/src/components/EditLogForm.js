import React, { useState, useEffect } from "react";

function EditLogForm({ logId, onCancel, onUpdated }) {
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load users and activities once
  useEffect(() => {
    fetch("http://localhost:5050/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setError("Failed to load users"));

    fetch("http://localhost:5050/api/details")
      .then((res) => res.json())
      .then(setActivities)
      .catch(() => setError("Failed to load activities"));
  }, []);

  // Load the log to edit
  useEffect(() => {
    if (!logId) return;

    setLoading(true);
    fetch(`http://localhost:5050/api/logs/${logId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load log");
        return res.json();
      })
      .then((log) => {
        setUserId(log.user_id.toString());
        setDate(log.date ? log.date.split("T")[0] : "");
        setDuration(log.duration.toString());
        setDescription(log.description || "");
        setDetails(
          log.details.length
            ? log.details.map((d) => ({
                id: d.id,
                exercise_id: d.exercise_id ? d.exercise_id.toString() : "",
                reps: d.reps ? d.reps.toString() : "",
                tempo: d.tempo ? d.tempo.toString() : "",
                name: d.name || "",
              }))
            : [{ exercise_id: "", reps: "", tempo: "" }]
        );
        setError(null);
      })
      .catch(() => setError("Error loading log"))
      .finally(() => setLoading(false));
  }, [logId]);

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const addDetail = () => {
    setDetails([...details, { exercise_id: "", reps: "", tempo: "" }]);
  };

  const removeDetail = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId || !duration) {
      setError("User and duration are required");
      return;
    }

    const filteredDetails = details
      .filter((d) => d.exercise_id && d.reps)
      .map((d) => ({
        exercise_id: parseInt(d.exercise_id),
        reps: parseInt(d.reps),
        tempo: d.tempo ? parseInt(d.tempo) : null,
        name: d.name || null,
      }));

    const payload = {
      user_id: parseInt(userId),
      date: date || new Date().toISOString().split("T")[0],
      duration: parseInt(duration),
      description,
      details: filteredDetails,
    };

    fetch(`http://localhost:5050/api/logs/${logId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update log");
        return res.json();
      })
      .then(() => {
        setError(null);
        if (onUpdated) onUpdated();
      })
      .catch(() => setError("Error updating log"));
  };

  if (loading) return <p>Loading log data...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "1rem",
        backgroundColor: "#111",
        borderRadius: "8px",
        color: "#eee",
      }}
    >
      <h2>Edit Log</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label style={{ display: "block", marginBottom: "10px" }}>
        User:
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          style={{
            width: "100%",
            marginTop: "5px",
            padding: "6px",
            boxSizing: "border-box",
            borderRadius: "4px",
            backgroundColor: "#222",
            color: "#eee",
            border: "1px solid #444",
          }}
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "block", marginBottom: "10px" }}>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            marginTop: "5px",
            padding: "6px",
            boxSizing: "border-box",
            borderRadius: "4px",
            backgroundColor: "#222",
            color: "#eee",
            border: "1px solid #444",
          }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "10px" }}>
        Duration (minutes):
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          min="1"
          style={{
            width: "100%",
            marginTop: "5px",
            padding: "6px",
            boxSizing: "border-box",
            borderRadius: "4px",
            backgroundColor: "#222",
            color: "#eee",
            border: "1px solid #444",
          }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "10px" }}>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            marginTop: "5px",
            padding: "6px",
            boxSizing: "border-box",
            borderRadius: "4px",
            backgroundColor: "#222",
            color: "#eee",
            border: "1px solid #444",
          }}
          rows={4}
        />
      </label>

      <h3>Exercises</h3>
      {details.map((detail, index) => (
        <div
          key={index}
          style={{
            marginBottom: "1rem",
            borderBottom: "1px solid #444",
            paddingBottom: "10px",
          }}
        >
          <label style={{ display: "block", marginBottom: "5px" }}>
            Exercise:
            <select
              value={detail.exercise_id}
              onChange={(e) =>
                handleDetailChange(index, "exercise_id", e.target.value)
              }
              required
              style={{
                width: "100%",
                marginTop: "5px",
                padding: "6px",
                boxSizing: "border-box",
                borderRadius: "4px",
                backgroundColor: "#222",
                color: "#eee",
                border: "1px solid #444",
              }}
            >
              <option value="">Select exercise</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.detail_name}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "block", marginBottom: "5px" }}>
            Reps:
            <input
              type="number"
              placeholder="Reps"
              value={detail.reps}
              onChange={(e) =>
                handleDetailChange(index, "reps", e.target.value)
              }
              required
              min="1"
              style={{
                width: "100%",
                marginTop: "5px",
                padding: "6px",
                boxSizing: "border-box",
                borderRadius: "4px",
                backgroundColor: "#222",
                color: "#eee",
                border: "1px solid #444",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "5px" }}>
            Tempo (bpm):
            <input
              type="number"
              placeholder="Tempo (bpm)"
              value={detail.tempo}
              onChange={(e) =>
                handleDetailChange(index, "tempo", e.target.value)
              }
              style={{
                width: "100%",
                marginTop: "5px",
                padding: "6px",
                boxSizing: "border-box",
                borderRadius: "4px",
                backgroundColor: "#222",
                color: "#eee",
                border: "1px solid #444",
              }}
            />
          </label>

          <button
            type="button"
            onClick={() => removeDetail(index)}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              fontSize: "1rem",
              backgroundColor: "#333",
              color: "#eee",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addDetail}
        style={{
          marginTop: "10px",
          padding: "8px 12px",
          fontSize: "1rem",
          backgroundColor: "#333",
          color: "#eee",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add Exercise
      </button>

      <br />
      <br />
      <button
        type="submit"
        style={{
          padding: "10px 15px",
          fontSize: "1rem",
          backgroundColor: "#555",
          color: "#eee",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Save Changes
      </button>

      <button
        type="button"
        onClick={onCancel}
        style={{
          marginTop: "10px",
          padding: "10px 15px",
          fontSize: "1rem",
          backgroundColor: "#a00",
          color: "#eee",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Cancel
      </button>
    </form>
  );
}

export default EditLogForm;
