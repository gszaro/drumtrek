import React, { useState } from 'react';

function AddSessionForm({ onSessionAdded }) {
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const session = {
      user_id: Number(userId),
      date,
      duration_minutes: Number(duration),
      notes
    };

    const res = await fetch('http://localhost:5050/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });

    if (res.ok) {
      const newSession = await res.json();
      onSessionAdded(newSession); // notify parent to refresh list
      setUserId('');
      setDate('');
      setDuration('');
      setNotes('');
    } else {
      alert('Failed to add session');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Practice Session</h3>
      <div>
        <label>User ID: </label>
        <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} required />
      </div>
      <div>
        <label>Date: </label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label>Duration (min): </label>
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
      </div>
      <div>
        <label>Notes: </label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <button type="submit">Add Session</button>
    </form>
  );
}

export default AddSessionForm;
