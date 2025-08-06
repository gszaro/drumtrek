import React, { useEffect } from "react";
import styles from "./formStyles.module.css";

function LogDetailModal({ log, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden"; // prevent scroll
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto"; // restore scroll
    };
  }, [onClose]);

  if (!log) return null;

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
        <h3>Log Details</h3>
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
