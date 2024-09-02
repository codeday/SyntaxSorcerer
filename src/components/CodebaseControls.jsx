"use client";
import { useRef } from "react";

export default function CodebaseControls() {
  const codebaseURLInput = useRef(null);

  // Download a codebase
  async function downloadCodebase() {
    const response = await fetch(`${process.env.URL}/download`, {
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
    const response = await fetch(`${process.env.URL}/delete`, {
      method: "DELETE",
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
    <div className="flex">
      <input
        type="text"
        ref={codebaseURLInput}
        id="codebase-url"
        placeholder="Enter codebase URL (must be a link to download a .zip file)"
      ></input>
      <button id="download-button" onClick={downloadCodebase}>
        Download
      </button>
      <button id="delete-button" onClick={deleteCodebase}>
        Remove
      </button>
    </div>
  );
}
