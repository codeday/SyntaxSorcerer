"use client";
import styles from "../app/styles/Chatbot.module.css";
import CodebaseControls from "@/components/CodebaseControls";
import QueryControls from "@/components/QueryControls";
import Chatbot from "@/components/Chatbot";
import { useEffect, useState } from "react";
import Image from "next/image";

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
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.flex}>
        <Image src='./icon.svg' alt='The app logo, a glowing hexagon.' width={80} height={80}></Image>
        <h1 className={styles.title}>Syntax Sorcerer</h1>
        </div>
        <CodebaseControls />
        <Chatbot />
        <QueryControls />
      </div>
    </div>
  );
}