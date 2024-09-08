"use client";

import Image from "next/image";
import styles from "../app/styles/Chatbot.module.css";
import CodebaseControls from "@/components/CodebaseControls";
import QueryControls from "@/components/QueryControls";
import Chatbot from "@/components/Chatbot";
import { useEffect, useState } from "react";

export default function Home() {
  const [hasSeed, setHasSeed] = useState(false);

  useEffect(() => {
    const checkSeed = () => {
      // Check if the seed cookie exists on the client side
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {});

      setHasSeed(!!cookies['seed']);
    };
    checkSeed();
  }, []);

  console.log(hasSeed);

  useEffect(() => {
    if (!hasSeed) {
      // Fetch the seed if it has not been set
      fetch(`${process.env.NEXT_PUBLIC_URL}/config/seed`)
        .then(response => response.json())
        .then(data => {
          console.log('Seed fetched:', data);
        })
        .catch(console.error);
    }
  }, [hasSeed]);

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.title}>💻 Syntax Sorcerer</h1>
        <CodebaseControls />
        <Chatbot />
        <QueryControls />
      </div>
    </div>
  );
}