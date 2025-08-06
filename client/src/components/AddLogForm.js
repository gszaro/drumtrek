import React, { useState } from "react";
import styles from "./formStyles.module.css";

function AddLogForm({ onLogAdded }) {
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState([{ name: "", reps: "", tempo: "" }]);

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...details];
    updatedDetails[index][field] = value;
    setDetails(updatedDetails);
  };

  const addExercise = () => {
    setDetails([...details, { name: "", reps: "", tempo: "" }]);
  };

  const removeExercise = () => {
    if (details.length > 1) {
      setDetails(details.slice(0, -1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newLog = {
      username,
      date,
      duration: parseInt(duration),
      description,
      details,
    };

    try {
      const res = await fetch("http://localhost:5050/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add log");
      }

      onLogAdded();
      setUsername("");
      setDate("");
      setDuration("");
      setDescription("");
      setDetails([{ name: "", reps: "", tempo: "" }]);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.heading}>Add New Log</h2>

      <div className={styles.row}>
        <label>User:</label>
        <select
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        >
          <option value="">Select user</option>
          <option value="gregdrums">gregdrums</option>
          <option value="jazzcat">jazzcat</option>
        </select>
      </div>

      <div className={styles.row}>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className={styles.row}>
        <label>Duration (minutes):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>

      <div className={styles.row}>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Optional notes"
        />
      </div>

      <h3 className={styles.subheading}>Exercises</h3>
      {details.map((detail, index) => (
        <div key={index} className={styles.exerciseRow}>
          <select
            value={detail.name}
            onChange={(e) => handleDetailChange(index, "name", e.target.value)}
            required
          >
            <option value="">Select exercise</option>
            <option value="rudiments">Rudiments</option>
            <option value="independence">Independence</option>
            <option value="groove">Groove</option>
          </select>
          <input
            type="text"
            placeholder="Reps"
            value={detail.reps}
            onChange={(e) => handleDetailChange(index, "reps", e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tempo (bpm)"
            value={detail.tempo}
            onChange={(e) => handleDetailChange(index, "tempo", e.target.value)}
            required
          />
        </div>
      ))}

      <div className={styles.buttonRow}>
        <button type="button" onClick={addExercise} className={styles.button}>
          Add Exercise
        </button>
        <button
          type="button"
          onClick={removeExercise}
          className={styles.button}
        >
          Remove
        </button>
      </div>

      <hr />

      <button type="submit" className={styles.submitButton}>
        Submit Log
      </button>
    </form>
  );
}

export default AddLogForm;
