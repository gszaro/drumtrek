import React, { useState, useEffect } from "react";
import styles from "./formStyles.module.css";

function AddLogForm({ onLogAdded }) {
  // Dropdown data
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  // Loading indicators
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingExercises, setLoadingExercises] = useState(true);
  // Error state for users fetch
  const [loadError, setLoadError] = useState(null);

  // Main form state
  const [form, setForm] = useState({
    user_id: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    duration: "",
    description: "",
    details: [], // Array of exercise details
  });

  // Temporary state for adding a single exercise before pushing into form.details
  const [newDetail, setNewDetail] = useState({
    exercise_id: "",
    name: "",
    reps: "",
    tempo: "",
  });

  // Fetch users and exercises on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setLoadError(null);
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error(`Users fetch failed: ${res.status}`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Users load error:", err);
        setUsers([]);
        setLoadError("Failed to load users.");
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchExercises = async () => {
      setLoadingExercises(true);
      try {
        const res = await fetch("/api/exercises");
        if (!res.ok) throw new Error(`Exercises fetch failed: ${res.status}`);
        const data = await res.json();
        setExercises(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Exercises load error:", err);
        setExercises([]);
      } finally {
        setLoadingExercises(false);
      }
    };

    fetchUsers();
    fetchExercises();
  }, []);

  // Add a new exercise detail to the form
  const handleAddDetail = () => {
    // Must have reps, tempo, and either a selected exercise or a name
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

    // Reset the temporary newDetail form
    setNewDetail({
      exercise_id: "",
      name: "",
      reps: "",
      tempo: "",
    });
  };

  // Remove an exercise from the form by index
  const handleDeleteDetail = (index) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  // Submit the form to the server
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If no exercises in details yet but current newDetail is filled, auto-add it
    const pendingIsFilled =
      (!!newDetail.exercise_id || !!newDetail.name) &&
      !!newDetail.reps &&
      !!newDetail.tempo;

    const payload = {
      ...form,
      details:
        form.details.length === 0 && pendingIsFilled
          ? [...form.details, newDetail]
          : form.details,
    };

    // Basic validation before sending
    if (!payload.user_id || !payload.duration || payload.details.length === 0) {
      alert("Please fill all required fields and add at least one exercise.");
      return;
    }

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to add log");
      }

      const data = await res.json();
      alert("✅ Log added!");

      // Reset the form after success
      setForm({
        user_id: "",
        date: new Date().toISOString().split("T")[0],
        duration: "",
        description: "",
        details: [],
      });
      setNewDetail({ exercise_id: "", name: "", reps: "", tempo: "" });

      // Notify parent to refresh logs
      if (onLogAdded) onLogAdded(data);
    } catch (err) {
      console.error("❌ Error adding log:", err);
      alert(`Something went wrong: ${err.message}`);
    }
  };

  // Render <option> list for users
  const userOptions =
    Array.isArray(users) && users.length > 0 ? (
      users.map((u) => (
        <option key={u.id} value={u.id}>
          {u.username}
        </option>
      ))
    ) : (
      <option value="" disabled>
        {loadError ? "Failed to load users" : "No users found — add one first"}
      </option>
    );

  // Render <option> list for exercises
  const exerciseOptions =
    Array.isArray(exercises) && exercises.length > 0 ? (
      exercises.map((ex) => (
        <option key={ex.id} value={ex.id}>
          {ex.detail_name}
        </option>
      ))
    ) : (
      <option value="">None</option>
    );

  // Determine if reps and tempo fields should be required
  const requireExerciseFields = !!newDetail.exercise_id || !!newDetail.name;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Add Practice Log</h2>

      {/* User selection */}
      <label>User:</label>
      <select
        value={form.user_id}
        onChange={(e) => setForm({ ...form, user_id: e.target.value })}
        required
      >
        <option value="">
          {loadingUsers ? "Loading users..." : "Select user"}
        </option>
        {userOptions}
      </select>

      {/* Date */}
      <label>Date:</label>
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      {/* Duration */}
      <label>Duration (minutes):</label>
      <input
        type="number"
        value={form.duration}
        onChange={(e) => setForm({ ...form, duration: e.target.value })}
        required
      />

      {/* Notes */}
      <label>Notes (optional):</label>
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <hr />
      <h3>Add Exercises</h3>

      {/* Exercise selection from master list */}
      <label>Pick from Master List:</label>
      <select
        value={newDetail.exercise_id}
        onChange={(e) =>
          setNewDetail({
            ...newDetail,
            exercise_id: e.target.value,
            name: "", // Clear manual name when selecting from list
          })
        }
        disabled={loadingExercises}
      >
        <option value="">{loadingExercises ? "Loading..." : "None"}</option>
        {exerciseOptions}
      </select>

      {/* Manual exercise name entry */}
      <label>Or enter exercise name manually:</label>
      <input
        type="text"
        value={newDetail.name}
        onChange={(e) =>
          setNewDetail({
            ...newDetail,
            name: e.target.value,
            exercise_id: "", // Clear dropdown when typing
          })
        }
        placeholder="e.g. Paradiddle Groove"
      />

      {/* Reps */}
      <label>Reps:</label>
      <input
        type="number"
        value={newDetail.reps}
        onChange={(e) => setNewDetail({ ...newDetail, reps: e.target.value })}
        required={requireExerciseFields}
      />

      {/* Tempo */}
      <label>Tempo (BPM):</label>
      <input
        type="number"
        value={newDetail.tempo}
        onChange={(e) => setNewDetail({ ...newDetail, tempo: e.target.value })}
        required={requireExerciseFields}
      />

      {/* Add exercise button */}
      <button type="button" onClick={handleAddDetail}>
        ➕ Add Exercise
      </button>

      {/* Current exercise list */}
      <ul className={styles.exerciseList}>
        {form.details.map((d, idx) => {
          const exName =
            d.name ||
            (Array.isArray(exercises)
              ? exercises.find((ex) => ex.id === parseInt(d.exercise_id))
                  ?.detail_name
              : "");
          return (
            <li key={idx}>
              {exName || "Unnamed"} — {d.reps} reps @ {d.tempo} bpm{" "}
              <button type="button" onClick={() => handleDeleteDetail(idx)}>
                ❌
              </button>
            </li>
          );
        })}
      </ul>

      {/* Submit log */}
      <button type="submit">Submit</button>
    </form>
  );
}

export default AddLogForm;
