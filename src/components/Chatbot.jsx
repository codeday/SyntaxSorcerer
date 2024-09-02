import styles from "../app/styles/Chatbot.module.css"; // Updated import for CSS Modules

export default function Chatbot() {
  
  async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if(userInput.trim() === "") return;
  }
  
  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.title}>💻 Syntax Sorcerer</h1>
        <div className={styles.flex}>
          <input
            type="text"
            id="codebase-url"
            className={styles.input}
            placeholder="Enter codebase URL (must be a link to download a .zip file)"
          />
          <button
            id="download-button"
            className={styles.button}
            onClick={downloadCodebase}
          >
            Download
          </button>
          <button
            id="delete-button"
            className={styles.button}
            onClick={deleteCodebase}
          >
            Remove
          </button>
        </div>
        <div className={styles.chatbox}>
          <div id="messages" className={styles.messages}></div>
        </div>
        <textarea
          id="user-input"
          className={styles.userInput}
          placeholder="Type your message here..."
        ></textarea>
        <div className={styles.submitButtons}>
          <button
            id="send-button"
            className={styles.button}
            onClick={sendMessage}
          >
            Enter
          </button>
          <button
            id="query-button"
            className={styles.button}
            onClick={sendCodebaseQuery}
          >
            Query codebase
          </button>
        </div>
      </div>
    </div>
  );
}

