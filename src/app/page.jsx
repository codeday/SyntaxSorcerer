"use client";
import styles from "../app/styles/Chatbot.module.css";
import CodebaseControls from "@/components/CodebaseControls";
import QueryControls from "@/components/QueryControls";
import Chatbot from "@/components/Chatbot";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [hasSeed, setHasSeed] = useState(false);
  const [seedFetched, setSeedFetched] = useState(false); 

  useEffect(() => {
    const checkSeed = () => {
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {});
      setHasSeed(!!cookies['seed']);
    };
    checkSeed();
  }, []);

  useEffect(() => {
    if (!hasSeed) {
      fetch(`${process.env.NEXT_PUBLIC_URL}/config/seed`)
        .then(response => response.json())
        .then(() => setSeedFetched(true))
        .catch(console.error);
    } else {
      setSeedFetched(true);
    }
  }, [hasSeed]);

  useEffect(() => {
      if (hasSeed && seedFetched) {
        // Initialize the chatbot's memory cache
        fetch(`${process.env.NEXT_PUBLIC_URL}/chat/memory`)
          .then(response => response.json())
          .catch(console.error);
      }
  }, [hasSeed, seedFetched]);

  return (
    <div className={styles.wrapper}>
      {/* Main content container */}
      {/* Main content container */}
      <div className={styles.container}>
        <div className={styles.flex}>
          <Image src="./icon.svg" alt="The app logo, a glowing hexagon." width={80} height={80} />
          <h1 className={styles.title}>Syntax Sorcerer</h1>
        </div>
        
        {/* Main content: CodebaseControls, Chatbot, QueryControls */}
        <div className={styles.mainContent}>
          <CodebaseControls />
          <Chatbot />
          <QueryControls />
        </div>
        
        {/* Right-side navigation bar 
        <div className={styles.navbar}>
          <h3>Navigation</h3>
          <ul>
            <li><a href="#section1">Section 1</a></li>
            <li><a href="#section2">Section 2</a></li>
            <li><a href="#section3">Section 3</a></li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
