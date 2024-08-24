import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <div className="container">
          <h1>💻  Syntax Sorcerer</h1>
          <div className="flex">
            <input type="text" id="codebase-url" placeholder="Enter codebase URL (must be a link to download a .zip file)"></input>
            <button id="download-button" onClick={ downloadCodebase }>Download</button>
            <button id="delete-button" onClick={ deleteCodebase }>Remove</button>
          </div>
          <div id="chatbox">
              <div id="messages"></div>
          </div>
          <textarea id="user-input" placeholder="Type your message here..."></textarea>
          <div className="submit-buttons">
            <button id="send-button" onClick={ sendMessage }>Enter</button>
            <button id="query-button" onClick={ sendCodebaseQuery }>Query codebase</button>
          </div>
      </div>
    </div>
  );
}
