import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditLogForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user_id: "",
    date: "",
    duration: "",
    description: "",
    details: [],
  });

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await fetch(`/api/logs/${id}`);
        const data = await res.json();
        setForm({
          user_id: data.user_id,
          date: data.date.split("T")[0],
          duration: data.duration,
          description: data.description,
          details: data.details || [],
        });
      } catch (err) {
        console.error("❌ Error fetching log:", err);
      }
    };

    fetchLog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
        navigate("/");
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
      <label>User ID:</label>
      <input
        name="user_id"
        value={form.user_id}
        onChange={handleChange}
        required
      />
      <label>Date:</label>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />
      <label>Duration (minutes):</label>
      <input
        name="duration"
        value={form.duration}
        onChange={handleChange}
        required
      />
      <label>Description:</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
      />
      <button type="submit">Update</button>
    </form>
  );
}

export default EditLogForm;
