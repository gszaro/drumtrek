import React, { useEffect } from "react";
import styles from "./formStyles.module.css";

function LogDetailModal({ log, onClose }) {
  // Handle escape key press and disable background scroll when modal is open
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden"; // Lock page scroll
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto"; // Restore scroll
    };
  }, [onClose]);

  // If no log data provided, don't render anything
  if (!log) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${styles.fadeIn}`}
      onClick={onClose} // Close when clicking the overlay
    >
      <div
        className={`${styles.modalContent} ${styles.scaleIn}`}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        <button onClick={onClose} className={styles.modalCloseButton}>
          &times;
        </button>
        <h3>Log Details</h3>

        {/* Basic log info */}
        <p>
          <strong>User:</strong> {log.username}
        </p>
        <p>
          <strong>Date:</strong> {new Date(log.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Duration:</strong> {log.duration} minutes
        </p>
        <p>
          <strong>Description:</strong> {log.description}
        </p>

        {/* Exercise details if available */}
        {log.details && log.details.length > 0 && (
          <>
            <h4>Exercises:</h4>
            <ul className={styles.exerciseList}>
              {log.details.map((detail, idx) => (
                <li key={idx}>
                  {detail.name} — {detail.reps} reps @ {detail.tempo} bpm
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default LogDetailModal;
