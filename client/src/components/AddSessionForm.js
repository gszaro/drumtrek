import React, { useState, useEffect } from "react";

function AddSessionForm({ onSessionAdded }) {
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseId, setExerciseId] = useState("");
  const [reps, setReps] = useState("");
  const [tempo, setTempo] = useState("");
  const [customExerciseName, setCustomExerciseName] = useState("");

  useEffect(() => {
    async function fetchUsersAndExercises() {
      const [usersRes, exercisesRes] = await Promise.all([
        fetch("http://localhost:5050/api/users"),
        fetch("http://localhost:5050/api/exercises"),
      ]);
      const usersData = await usersRes.json();
      const exercisesData = await exercisesRes.json();
      setUsers(usersData);
      setExercises(exercisesData);
    }
    fetchUsersAndExercises();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const session = {
      user_id: Number(userId),
      date,
      duration_minutes: Number(duration),
      notes,
    };

    try {
      // Submit the main session
      const res = await fetch("http://localhost:5050/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });

      if (!res.ok) {
        throw new Error("Failed to create session");
      }

      const newSession = await res.json();

      // Submit each selected exercise for the session
      for (let ex of selectedExercises) {
        await fetch("http://localhost:5050/api/session_exercises", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: newSession.id,
            exercise_id: ex.exercise_id,
            reps: ex.reps,
            tempo: ex.tempo,
          }),
        });
      }

      // Reset form + notify parent
      onSessionAdded(newSession);
      setUserId("");
      setDate("");
      setDuration("");
      setNotes("");
      setSelectedExercises([]);
      setExerciseId("");
      setReps("");
      setTempo("");
    } catch (error) {
      console.error(error);
      alert("There was an error submitting the session");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Practice Session</h3>
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
        <label>Notes: </label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <button type="submit">Add Session</button>
      <h4>Add Exercises</h4>
      <div>
        <label>Exercise: </label>
        <select
          value={exerciseId}
          onChange={(e) => setExerciseId(e.target.value)}
        >
          <option value="">Select</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
          <option value="custom">Custom Exercise</option>
        </select>
      </div>
      {exerciseId === "custom" && (
        <div>
          <label>Custom Name: </label>
          <input
            type="text"
            value={customExerciseName}
            onChange={(e) => setCustomExerciseName(e.target.value)}
            required
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
      <button
        type="button"
        onClick={() => {
          if (exerciseId) {
            const added = exercises.find((ex) => ex.id === Number(exerciseId));
            setSelectedExercises([
              ...selectedExercises,
              {
                exercise_id: Number(exerciseId),
                name: added.name,
                reps: Number(reps),
                tempo: Number(tempo),
              },
            ]);
            setExerciseId("");
            setReps("");
            setTempo("");
          }
        }}
      >
        Add Exercise
      </button>

      <ul>
        {selectedExercises.map((ex, idx) => (
          <li key={idx}>
            {ex.name} – {ex.reps} reps @ {ex.tempo} BPM
          </li>
        ))}
      </ul>
    </form>
  );
}

export default AddSessionForm;
