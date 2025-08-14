import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditLogForm() {
  // Grab the log ID from the URL parameters
  const { id } = useParams();
  // For redirecting after a successful update
  const navigate = useNavigate();

  // Form state holds all log properties, including nested exercise details
  const [form, setForm] = useState({
    user_id: "",
    date: "",
    duration: "",
    description: "",
    details: [],
  });

  // Fetch the existing log data when the component mounts or when the ID changes
  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await fetch(`/api/logs/${id}`);
        const data = await res.json();
        setForm({
          user_id: data.user_id,
          date: data.date.split("T")[0], // Convert ISO datetime to YYYY-MM-DD format
          duration: data.duration,
          description: data.description,
          details: data.details || [], // Keep empty array if no details
        });
      } catch (err) {
        console.error("❌ Error fetching log:", err);
      }
    };

    fetchLog();
  }, [id]);

  // Generic handler for updating form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated log to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/logs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("✅ Log updated!");
        navigate("/"); // Redirect back to main page after update
      } else {
        alert("❌ Update failed");
      }
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Log</h2>

      {/* User ID — in a more advanced version, this could be a dropdown */}
      <label>User ID:</label>
      <input
        name="user_id"
        value={form.user_id}
        onChange={handleChange}
        required
      />

      {/* Date */}
      <label>Date:</label>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      {/* Duration */}
      <label>Duration (minutes):</label>
      <input
        name="duration"
        value={form.duration}
        onChange={handleChange}
        required
      />

      {/* Notes / Description */}
      <label>Description:</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
      />

      {/* Submit button */}
      <button type="submit">Update</button>
    </form>
  );
}

export default EditLogForm;
