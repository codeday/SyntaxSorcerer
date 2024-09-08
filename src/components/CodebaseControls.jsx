"use client";
import { useRef } from "react";
import styles from "../app/styles/Chatbot.module.css";
import Swal from "sweetalert2";

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
      Swal.fire({title: 'Error',
      text: result.error,
      icon: 'error',
      heightAuto: false,
      confirmButtonColor: "#8d77d4"});
    } else {
      Swal.fire({title: 'Success',
      text: result.message,
      icon: 'success',
      heightAuto: false,
      confirmButtonColor: '#8d77d4'});
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
      Swal.fire({title: 'Error',
      text: result.error,
      icon: 'error',
      heightAuto: false,
      confirmButtonColor: "#8d77d4"});
    } else {
      Swal.fire({title: 'Success',
      text: result.message,
      icon: 'success',
      heightAuto: false,
      confirmButtonColor: '#8d77d4'});
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
