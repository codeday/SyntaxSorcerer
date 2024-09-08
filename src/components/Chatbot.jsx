"use client";
import styles from "../app/styles/Chatbot.module.css"; 

export default function Chatbot() {
  return (
    <div>
      <div className={styles.chatbox}>
        <div id="messages" className={styles.messages}></div>
      </div>
      <textarea
        id="user-input"
        className={styles.userInput}
        placeholder="Type your message here..."
      ></textarea>
    </div>
  );
}

