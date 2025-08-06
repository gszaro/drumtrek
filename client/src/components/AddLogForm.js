import React, { useState, useEffect } from "react";
import styles from "./formStyles.module.css";

function AddLogForm({ onLogAdded }) {
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState([
    { exercise_id: "", reps: "", tempo: "" },
  ]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

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
      }));

    const payload = {
      user_id: parseInt(userId),
      date: date || new Date().toISOString().split("T")[0],
      duration: parseInt(duration),
      description,
      details: filteredDetails,
    };

    fetch("http://localhost:5050/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add log");
        return res.json();
      })
      .then(() => {
        setError(null);
        setUserId("");
        setDate("");
        setDuration("");
        setDescription("");
        setDetails([{ exercise_id: "", reps: "", tempo: "" }]);
        if (onLogAdded) onLogAdded();
      })
      .catch(() => setError("Error submitting form"));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.formTitle}>Add New Log</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label className={styles.label}>
        User:
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className={styles.select}
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="YYYY-MM-DD"
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Duration (minutes):
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          min="1"
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional notes"
          className={styles.textarea}
        />
      </label>

      <h3 className={styles.sectionTitle}>Exercises</h3>
      {details.map((detail, index) => (
        <div
          key={index}
          style={{
            marginBottom: "1rem",
            borderBottom: "1px solid #444",
            paddingBottom: "10px",
          }}
        >
          <label className={styles.label}>
            Exercise:
            <select
              value={detail.exercise_id}
              onChange={(e) =>
                handleDetailChange(index, "exercise_id", e.target.value)
              }
              required
              className={styles.select}
            >
              <option value="">Select exercise</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.detail_name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
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
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Tempo (bpm):
            <input
              type="number"
              placeholder="Tempo (bpm)"
              value={detail.tempo}
              onChange={(e) =>
                handleDetailChange(index, "tempo", e.target.value)
              }
              className={styles.input}
            />
          </label>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            {index === details.length - 1 && (
              <button
                type="button"
                onClick={addDetail}
                className={`${styles.button} ${styles.addButton}`}
              >
                Add Exercise
              </button>
            )}
            <button
              type="button"
              onClick={() => removeDetail(index)}
              className={`${styles.button} ${styles.removeButton}`}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <br />
      <button
        type="submit"
        className={`${styles.button} ${styles.submitButton}`}
      >
        Submit Log
      </button>
    </form>
  );
}

export default AddLogForm;
