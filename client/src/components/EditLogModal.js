import React, { useState, useEffect } from "react";
import styles from "./formStyles.module.css";

function EditLogModal({ log, users, detailsMaster, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    user_id: log.user_id,
    date: log.date.slice(0, 10),
    duration: log.duration,
    description: log.description || "",
    details: log.details || [],
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleDetailChange = (idx, field, value) => {
    const updated = [...formData.details];
    updated[idx][field] = value;
    setFormData((f) => ({ ...f, details: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/logs/${log.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update log");
      await res.json(); // Removed 'updated' variable to avoid ESLint warning
      onUpdate(); // refresh parent
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update log.");
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${styles.fadeIn}`}
      onClick={onClose}
    >
      <div
        className={`${styles.modalContent} ${styles.scaleIn}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className={styles.modalCloseButton}>
          &times;
        </button>
        <h3>Edit Log</h3>
        <form onSubmit={handleSubmit}>
          <label>User</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <label>Duration (min)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <h4>Details</h4>
          {formData.details.map((detail, idx) => (
            <div key={idx} className={styles.detailRow}>
              <select
                value={detail.exercise_id || ""}
                onChange={(e) =>
                  handleDetailChange(idx, "exercise_id", e.target.value)
                }
              >
                <option value="">Custom Name</option>
                {detailsMaster.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.detail_name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Or enter custom name"
                value={detail.name || ""}
                onChange={(e) =>
                  handleDetailChange(idx, "name", e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Reps"
                value={detail.reps || ""}
                onChange={(e) =>
                  handleDetailChange(idx, "reps", e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Tempo"
                value={detail.tempo || ""}
                onChange={(e) =>
                  handleDetailChange(idx, "tempo", e.target.value)
                }
              />
            </div>
          ))}

          <button type="submit" className={styles.submitButton}>
            Update Log
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditLogModal;
