import Image from "next/image";
import styles from "./page.module.css";
import CodebaseControls from "../components/CodebaseControls";

export default function Home() {
  return (
    <div>
      <div className="container">
        <h1>💻 Syntax Sorcerer</h1>
        <CodebaseControls />
        <div id="chatbox">
          <div id="messages"></div>
        </div>
        <textarea
          id="user-input"
          placeholder="Type your message here..."
        ></textarea>
        <div className="submit-buttons">
          <button id="send-button" onClick={sendMessage}>
            Enter
          </button>
          <button id="query-button" onClick={sendCodebaseQuery}>
            Query codebase
          </button>
        </div>
      </div>
    </div>
  );
}
