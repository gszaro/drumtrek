import React, { useState, useEffect } from "react";
import styles from "./formStyles.module.css";

function AddLogForm({ onLogAdded }) {
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    date: new Date().toISOString().split("T")[0],
    duration: "",
    description: "",
    details: [],
  });

  const [newDetail, setNewDetail] = useState({
    exercise_id: "",
    name: "",
    reps: "",
    tempo: "",
  });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);

    fetch("/api/exercises")
      .then((res) => res.json())
      .then(setExercises)
      .catch(console.error);
  }, []);

  const handleAddDetail = () => {
    if (
      !newDetail.reps ||
      !newDetail.tempo ||
      (!newDetail.exercise_id && !newDetail.name)
    ) {
      alert("Please fill out reps, tempo, and either select or type a name.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      details: [...prev.details, newDetail],
    }));

    setNewDetail({
      exercise_id: "",
      name: "",
      reps: "",
      tempo: "",
    });
  };

  const handleDeleteDetail = (index) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.user_id || !form.duration || form.details.length === 0) {
      alert("Please fill all required fields and add at least one exercise.");
      return;
    }

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add log");

      const data = await res.json();
      alert("✅ Log added!");
      setForm({
        user_id: "",
        date: new Date().toISOString().split("T")[0],
        duration: "",
        description: "",
        details: [],
      });
      if (onLogAdded) onLogAdded(data);
    } catch (err) {
      console.error("❌ Error adding log:", err);
      alert("Something went wrong");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Add Practice Log</h2>

      <label>User:</label>
      <select
        value={form.user_id}
        onChange={(e) => setForm({ ...form, user_id: e.target.value })}
        required
      >
        <option value="">Select user</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.username}
          </option>
        ))}
      </select>

      <label>Date:</label>
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <label>Duration (minutes):</label>
      <input
        type="number"
        value={form.duration}
        onChange={(e) => setForm({ ...form, duration: e.target.value })}
        required
      />

      <label>Notes (optional):</label>
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <hr />
      <h3>Add Exercises</h3>

      <label>Pick from Master List:</label>
      <select
        value={newDetail.exercise_id}
        onChange={(e) =>
          setNewDetail({
            ...newDetail,
            exercise_id: e.target.value,
            name: "",
          })
        }
      >
        <option value="">None</option>
        {exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.detail_name}
          </option>
        ))}
      </select>

      <label>Or enter exercise name manually:</label>
      <input
        type="text"
        value={newDetail.name}
        onChange={(e) =>
          setNewDetail({
            ...newDetail,
            name: e.target.value,
            exercise_id: "",
          })
        }
        placeholder="e.g. Paradiddle Groove"
      />

      <label>Reps:</label>
      <input
        type="number"
        value={newDetail.reps}
        onChange={(e) => setNewDetail({ ...newDetail, reps: e.target.value })}
        required
      />

      <label>Tempo (BPM):</label>
      <input
        type="number"
        value={newDetail.tempo}
        onChange={(e) => setNewDetail({ ...newDetail, tempo: e.target.value })}
        required
      />

      <button type="button" onClick={handleAddDetail}>
        ➕ Add Exercise
      </button>

      <ul className={styles.exerciseList}>
        {form.details.map((d, idx) => (
          <li key={idx}>
            {d.name ||
              exercises.find((ex) => ex.id === parseInt(d.exercise_id))
                ?.detail_name}{" "}
            — {d.reps} reps @ {d.tempo} bpm{" "}
            <button type="button" onClick={() => handleDeleteDetail(idx)}>
              ❌
            </button>
          </li>
        ))}
      </ul>

      <button type="submit">Submit</button>
    </form>
  );
}

export default AddLogForm;
