"use client";
import { useRef } from "react";
import styles from "../app/styles/Chatbot.module.css";

export default function CodebaseControls() {
  const codebaseURLInput = useRef(null);

  // Download a codebase
  async function downloadCodebase() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: codebaseURLInput.current.value }),
    });

    const result = await response.json();
    if (result.error) {
      alert(result.error);
    } else {
      alert("Codebase downloaded and cached");
    }
  }

  // Delete the codebase
  async function deleteCodebase() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/delete`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const result = await response.json();
    if (result.error) {
      alert(result.error);
    } else {
      alert("Codebase successfully deleted");
    }
  }  
  
  return (
    <div className={styles.flex}>
      <input
        type="text"
        id="codebase-url"
        className={styles.input}
        placeholder="Enter codebase URL (must be a link to download a .zip file)"
        ref={codebaseURLInput}
      />
      <button
        id="download-button"
        className={styles.codebaseButton}
        onClick={downloadCodebase}
      >
        Download
      </button>
      <button
        id="delete-button"
        className={styles.codebaseButton}
        onClick={deleteCodebase}
      >
        Remove
      </button>
    </div>
  );
}
