"use client";

import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

export default function ChatPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Chat</h1>
      </header>
      
      <main className={styles.main}>
        <div className={styles.chatWindow}>
          <div className={styles.messages}>
            {/* Messages will be displayed here */}
            <div className={styles.messageItem}>
              <div className={styles.messageContent}>
                <p>Welcome to the chat! This is a sample message.</p>
              </div>
            </div>
          </div>
          
          <div className={styles.inputArea}>
            <input 
              type="text" 
              className={styles.messageInput} 
              placeholder="Type your message..."
            />
            <Button appName="web" className={styles.sendButton}>
              Send
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 