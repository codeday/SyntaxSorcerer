import { useRef } from 'react';

export default function CodebaseControls() {

    // Download a codebase
    async function downloadCodebase() {
        const codebaseURLInput = useRef(null);
    
        const response = await fetch(`${process.env.URL}/api/download`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "url": codebaseURLInput.current.value }),
        });
    
        const result = await response.json();
        if (result.error) {
            alert(result.error);
        } else {
            alert("Codebase downloaded and cached");
        }
    }

    return (
        <div className="flex">
            <input type="text" ref={ codebaseURLInput } id="codebase-url" placeholder="Enter codebase URL (must be a link to download a .zip file)"></input>
            <button id="download-button" onClick={ downloadCodebase }>Download</button>
            <button id="delete-button" onClick={ deleteCodebase }>Remove</button>
        </div>
    );
}